import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import { queryExercisesByWorkoutId, queryWorkoutById } from 'queries/workouts';
import { WORKOUT_CATEGORIES, WORKOUT_TYPES } from 'test/helpers/env';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { createFullTestWorkout, createTestWorkout } from 'test/helpers/workout';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Clone Workout API', function () {
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

  describe('Clone a workout', function () {
    it('responds with 401 if missing Cookie', async function () {
      const workoutId = await createTestWorkout(accountId);
      const response = await axiosAPIClient.post(
        `/workouts/${workoutId}/copy/`
      );
      expect(response.status).toBe(401);
    });

    it('responds with 201 when an empty workout is cloned', async function () {
      const body = {
        name: 'push 1.0',
        description: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(WORKOUT_CATEGORIES),
        type: faker.helpers.arrayElement(WORKOUT_TYPES),
      };
      const { workoutId } = await createFullTestWorkout(accountId, body);
      const response = await axiosAPIClient.post(
        `/workouts/${workoutId}/copy`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const newWorkoutId = response.data.workoutId;
      const newWorkout = await queryWorkoutById(newWorkoutId);
      expect(newWorkout).toMatchObject({
        workout_id: newWorkoutId,
        ...body,
        name: 'push 1.1',
      });
    });

    it('confirms the exercises and tasks are cloned correctly', async function () {
      const { workoutId } = await createFullTestWorkout(accountId);
      const response = await axiosAPIClient.post(
        `/workouts/${workoutId}/copy`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const newWorkoutId = response.data.workoutId;
      const newWorkout = await queryWorkoutById(newWorkoutId);
      const exercisesData = await queryExercisesByWorkoutId(newWorkoutId);
      const mappedTasks =
        newWorkout.task_order &&
        newWorkout.task_order.map((taskId: string) => {
          const exercises = exercisesData.filter(
            (e) => e.workout_task_id === taskId
          );

          return {
            workout_task_id: taskId,
            exercises: exercises.map((exercise) => {
              return {
                name: exercise.name,
                description: exercise.description,
                exercise_id: exercise.exercise_id,
                category: exercise.category,
                profile: exercise.profile,
                video: exercise.video,
                sets: exercise.sets,
                repetitions: exercise.repetitions,
                repsInReserve: exercise.reps_in_reserve,
                restPeriod: exercise.rest_period,
              };
            }),
          };
        });

      expect(mappedTasks[0].exercises.length).toBe(2);
      expect(mappedTasks[1].exercises.length).toBe(1);
    });
  });

  describe('Clone a workout via scheduling', function () {
    it('responds with 201 when an empty workout is cloned and scheduled today', async function () {
      const body = {
        name: 'legs 1.0.5',
        description: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(WORKOUT_CATEGORIES),
        type: faker.helpers.arrayElement(WORKOUT_TYPES),
      };
      const { workoutId } = await createFullTestWorkout(accountId, body);
      const response = await axiosAPIClient.post(
        `/workouts/${workoutId}/copy?date=today`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const newWorkoutId = response.data.workoutId;
      const newWorkout = await queryWorkoutById(newWorkoutId);

      expect(newWorkout).toMatchObject({
        workout_id: newWorkoutId,
        ...body,
        name: 'legs 1.0.6',
      });
    });

    it('responds with 201 when an empty workout is cloned and scheduled tomorrow', async function () {
      const body = {
        name: 'legs 1.0.5',
        description: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(WORKOUT_CATEGORIES),
        type: faker.helpers.arrayElement(WORKOUT_TYPES),
      };
      const { workoutId } = await createFullTestWorkout(accountId, body);
      const response = await axiosAPIClient.post(
        `/workouts/${workoutId}/copy?date=tomorrow`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const newWorkoutId = response.data.workoutId;
      const newWorkout = await queryWorkoutById(newWorkoutId);

      expect(newWorkout).toMatchObject({
        workout_id: newWorkoutId,
        ...body,
        name: 'legs 1.0.6',
      });
    });

    it('responds with 201 when an empty workout is cloned and scheduled on specific date', async function () {
      const body = {
        name: 'legs 1.0.5',
        description: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(WORKOUT_CATEGORIES),
        type: faker.helpers.arrayElement(WORKOUT_TYPES),
      };
      const { workoutId } = await createFullTestWorkout(accountId, body);
      const response = await axiosAPIClient.post(
        `/workouts/${workoutId}/copy?date=2024-01-01`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const newWorkoutId = response.data.workoutId;
      const newWorkout = await queryWorkoutById(newWorkoutId);

      expect(newWorkout).toMatchObject({
        workout_id: newWorkoutId,
        ...body,
        name: 'legs 1.0.6',
      });
    });

    it('confirms the exercises and tasks are cloned correctly during a schedule', async function () {
      const { workoutId } = await createFullTestWorkout(accountId);
      const response = await axiosAPIClient.post(
        `/workouts/${workoutId}/copy?date=today`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const newWorkoutId = response.data.workoutId;
      const newWorkout = await queryWorkoutById(newWorkoutId);
      const exercisesData = await queryExercisesByWorkoutId(newWorkoutId);
      const mappedTasks =
        newWorkout.task_order &&
        newWorkout.task_order.map((taskId: string) => {
          const exercises = exercisesData.filter(
            (e) => e.workout_task_id === taskId
          );

          return {
            workout_task_id: taskId,
            exercises: exercises.map((exercise) => {
              return {
                name: exercise.name,
                description: exercise.description,
                exercise_id: exercise.exercise_id,
                category: exercise.category,
                profile: exercise.profile,
                video: exercise.video,
                sets: exercise.sets,
                repetitions: exercise.repetitions,
                repsInReserve: exercise.reps_in_reserve,
                restPeriod: exercise.rest_period,
              };
            }),
          };
        });

      expect(mappedTasks[0].exercises.length).toBe(2);
      expect(mappedTasks[1].exercises.length).toBe(1);
    });
  });
});
