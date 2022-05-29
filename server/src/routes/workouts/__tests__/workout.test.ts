import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import { createTestExercise } from 'test/helpers/exercise';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { createTestWorkout } from 'test/helpers/workout';
import { initializeWebServer, stopWebServer } from 'test/server';
import { v4 as uuidv4 } from 'uuid';

describe('Workout API', function () {
  let axiosAPIClient: AxiosInstance;
  let cookie: string;
  let accountId: string;

  beforeAll(async () => {
    const apiConnection = await initializeWebServer();
    const axiosConfig = {
      baseURL: `http://localhost:${apiConnection.port}`,
      validateStatus: () => true,
    };
    axiosAPIClient = axios.create(axiosConfig);
    const user = await createAndAuthorizeUser();
    cookie = user.cookie;
    accountId = user.accountId;
  });

  afterAll(async () => {
    await stopWebServer();
  });

  const workoutBody = {
    name: faker.name.findName(),
    description: faker.lorem.sentence(),
    category: faker.helpers.arrayElement([
      'full body',
      'pull',
      'push',
      'chest',
      'arms',
      'back',
      'legs',
      'shoulders',
    ]),
    type: faker.helpers.arrayElement([
      'strength',
      'cardio',
      'hypertrophy',
      'therapy',
      'deload',
    ]),
  };

  describe('Fetching a single workout', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/workouts/not-found');
      expect(response.status).toBe(401);
    });

    it('responds with 403 if unaccessable by user', async function () {
      const workoutId = await createTestWorkout('-1');
      const response = await axiosAPIClient.get(`/workouts/${workoutId}`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(403);
    });

    it('responds with 404 if not found', async () => {
      const response = await axiosAPIClient.get('/workouts/not-found', {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(404);
    });

    it('responds with 200 when successful', async function () {
      const workoutId = await createTestWorkout(accountId);
      const response = await axiosAPIClient.get(`/workouts/${workoutId}`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(200);
    });
  });

  describe('Creating a workout', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.post('/workouts/');
      expect(response.status).toBe(401);
    });

    it('responds with 422 when empty body', async function () {
      const response = await axiosAPIClient.post(
        `/workouts/`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(422);
    });

    it('responds with 201 when workout meta is passed correctly', async function () {
      const response = await axiosAPIClient.post(
        `/workouts/`,
        {
          ...workoutBody,
          tasks: [],
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(201);
    });

    it('responds with 400 when exercises is passed incorrectly', async function () {
      const response = await axiosAPIClient.post(
        `/workouts/`,
        {
          ...workoutBody,
          tasks: [
            {
              id: uuidv4(),
              exercises: [
                {
                  exercise_id: 'not-found',
                },
              ],
            },
          ],
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(400);
    });

    it('confirm the task_order when exercises passed correctly during workout creation', async function () {
      const exercises = await Promise.all([
        createTestExercise(accountId),
        createTestExercise(accountId),
        createTestExercise(accountId),
      ]);
      const exercisesToAdd = exercises.slice(0, 2);
      const exerciseToAdd = exercises[2];

      const tasks = [
        {
          id: uuidv4(),
          exercises: exercisesToAdd.map((exercise) => {
            return {
              exercise_id: exercise.exercise_id,
            };
          }),
        },
        {
          id: uuidv4(),
          exercises: [
            {
              exercise_id: exerciseToAdd.exercise_id,
            },
          ],
        },
      ];

      const { data } = await axiosAPIClient.post(
        `/workouts/`,
        {
          ...workoutBody,
          tasks,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const response = await axiosAPIClient.get(`/workouts/${data.workoutId}`, {
        headers: {
          Cookie: cookie,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.workout.task_order.length).toBe(2);
      expect(response.data.workout).toMatchObject({
        name: workoutBody.name,
        description: workoutBody.description,
        category: workoutBody.category,
        type: workoutBody.type,
        hasSessions: false,
      });
      expect(response.data.workout.tasks[0].exercises.length).toBe(2);
      expect(response.data.workout.tasks[1].exercises.length).toBe(1);
    });
  });
});
