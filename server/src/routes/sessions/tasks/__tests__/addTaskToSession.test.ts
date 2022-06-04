import axios, { AxiosInstance } from 'axios';
import { createTestExercise } from 'test/helpers/exercise';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { createFullTestWorkout, createTestWorkout } from 'test/helpers/workout';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Add Task API', function () {
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

  describe('Adds a task to the end of the session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.post('/sessions/not-found/tasks/');
      expect(response.status).toBe(401);
    });

    it('responds with 403 when id not owned by user', async function () {
      const session = await createTestSession('-1');
      const response = await axiosAPIClient.post(
        `/sessions/${session.session_id}/tasks/`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 404 when no workout found', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.post(
        `/sessions/${session.session_id}/tasks/`,
        {
          workoutId: '-1',
          exercises: [],
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(404);
    });

    it('responds with 422 when sending an empty / invalid body', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.post(
        `/sessions/${session.session_id}/tasks/`,
        {
          workoutId: session.workout_id,
          exercises: 'invalid', // invalid should be an array
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(422);
    });

    it('responds with 201 when successfully adding a task with a single exercise to an unmarked workout', async function () {
      const session = await createTestSession(accountId);
      const exercise = await createTestExercise(accountId);
      const response = await axiosAPIClient.post(
        `/sessions/${session.session_id}/tasks/`,
        {
          workoutId: session.workout_id,
          exercises: [exercise.exercise_id],
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(201);
    });

    it('responds with 201 when successfully adding a task with multiple exercises to an unmarked workout', async function () {
      const session = await createTestSession(accountId);
      const exercises = await Promise.all([
        createTestExercise(accountId),
        createTestExercise(accountId),
      ]);
      const response = await axiosAPIClient.post(
        `/sessions/${session.session_id}/tasks/`,
        {
          workoutId: session.workout_id,
          exercises: exercises.map((exercise) => exercise.exercise_id),
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(201);
    });

    it('responds with 201 when successfully cloning the workout and adding a task with a single exercise', async function () {
      const { workoutId } = await createFullTestWorkout(accountId);
      const firstSession = await createTestSession(accountId, { workoutId });
      const secondSession = await createTestSession(accountId, { workoutId });

      const exercise = await createTestExercise(accountId);

      const response = await axiosAPIClient.post(
        `/sessions/${firstSession.session_id}/tasks/`,
        {
          workoutId: secondSession.workout_id,
          exercises: [exercise.exercise_id],
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(201);
    });

    it('responds with 201 when successfully cloning the workout and adding a task with multiple exercise', async function () {
      const { workoutId } = await createFullTestWorkout(accountId);
      const firstSession = await createTestSession(accountId, { workoutId });
      const secondSession = await createTestSession(accountId, { workoutId });

      const exercises = await Promise.all([
        createTestExercise(accountId),
        createTestExercise(accountId),
      ]);

      const response = await axiosAPIClient.post(
        `/sessions/${firstSession.session_id}/tasks/`,
        {
          workoutId: secondSession.workout_id,
          exercises: exercises.map((exercise) => exercise.exercise_id),
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(201);
    });
  });
});
