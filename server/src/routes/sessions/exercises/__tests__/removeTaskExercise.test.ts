import axios, { AxiosInstance } from 'axios';
import { updateWorkoutTaskOrder } from 'queries/workouts';
import {
  EXERCISE_CATEGORIES,
  EXERCISE_PROFILES,
  EXERCISE_TYPES,
} from 'test/helpers/env';
import { createTestExercise } from 'test/helpers/exercise';
import {
  createTestMuscleGroup,
  connectMuscleGroupToExercise,
} from 'test/helpers/muscle-group';
import {
  createTestSession,
  createTestSessionOnWorkout,
  createTestSessionWithSets,
} from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import {
  connectExerciseToWorkout,
  connectManyExercisesToWorkout,
  createTestWorkout,
} from 'test/helpers/workout';
import { initializeWebServer, stopWebServer } from 'test/server';
import { exercises_table, muscle_groups_table } from 'utils/databaseTypes';

describe('Remove Exercise From Task API', function () {
  let axiosAPIClient: AxiosInstance;
  let cookie: string;
  let accountId: string;
  let exercises: exercises_table[];
  let muscleGroups: muscle_groups_table[];

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

    muscleGroups = await Promise.all([
      createTestMuscleGroup(),
      createTestMuscleGroup(),
      createTestMuscleGroup(),
    ]);

    exercises = await Promise.all([
      createTestExercise(accountId, {
        category: EXERCISE_CATEGORIES[0],
        profile: EXERCISE_PROFILES[0],
        name: 'AAA',
        description: '111',
        type: EXERCISE_TYPES[0],
      }),
      createTestExercise(accountId, {
        category: EXERCISE_CATEGORIES[0],
        profile: EXERCISE_PROFILES[0],
        name: 'BBB',
        description: '222',
        type: EXERCISE_TYPES[0],
      }),
      createTestExercise(accountId, {
        category: EXERCISE_CATEGORIES[0],
        profile: EXERCISE_PROFILES[0],
        name: 'CCC',
        description: '222',
        type: EXERCISE_TYPES[0],
      }),
    ]);

    await Promise.all([
      // first exercise
      connectMuscleGroupToExercise(
        exercises[0].exercise_id!,
        muscleGroups[0].muscle_group_id!
      ),
      connectMuscleGroupToExercise(
        exercises[0].exercise_id!,
        muscleGroups[1].muscle_group_id!
      ),
      connectMuscleGroupToExercise(
        exercises[0].exercise_id!,
        muscleGroups[2].muscle_group_id!
      ),
      //second exercise
      connectMuscleGroupToExercise(
        exercises[1].exercise_id!,
        muscleGroups[0].muscle_group_id!
      ),
      connectMuscleGroupToExercise(
        exercises[1].exercise_id!,
        muscleGroups[1].muscle_group_id!
      ),
      connectMuscleGroupToExercise(
        exercises[1].exercise_id!,
        muscleGroups[2].muscle_group_id!
      ),
    ]);
  });

  afterAll(async () => {
    await stopWebServer();
  });

  describe('Removing an exercise within a task', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.delete(
        '/sessions/not-found/exercises/:exerciseId'
      );
      expect(response.status).toBe(401);
    });

    it('responds with 403 when resource not owned by user', async function () {
      const session = await createTestSessionWithSets('-1');
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/exercises/${session.exerciseIds[0]}`,

        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 404 when the exercise ID is invalid', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/exercises/not-found`,

        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(404);
    });

    it('responds with 422 if invalid body', async function () {
      const workoutId = await createTestWorkout(accountId);
      const session = await createTestSessionOnWorkout(workoutId, accountId);
      const { workout_task_id } = await connectExerciseToWorkout(
        exercises[2].exercise_id!,
        workoutId
      );
      await updateWorkoutTaskOrder({
        taskOrder: JSON.stringify([workout_task_id]),
        workoutId,
      });

      const currentExerciseId = exercises[2].exercise_id;
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/exercises/${currentExerciseId}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(422);
    });

    describe('That does not have sessions', () => {
      it('responds with 200 if cloned workout successfully and removing exercise from the task', async function () {
        const workoutId = await createTestWorkout(accountId);
        const secondSession = await createTestSessionOnWorkout(
          workoutId,
          accountId
        );
        const { workout_task_id, workoutTaskExercises } =
          await connectManyExercisesToWorkout(
            [
              {
                exercise_id: exercises[0].exercise_id!,
              },
              {
                exercise_id: exercises[1].exercise_id!,
              },
            ],
            workoutId
          );
        await updateWorkoutTaskOrder({
          taskOrder: JSON.stringify([workout_task_id]),
          workoutId,
        });
        const currentExerciseId = exercises[0].exercise_id;
        const response = await axiosAPIClient.delete(
          `/sessions/${secondSession.session_id}/exercises/${currentExerciseId}?workoutId=${workoutId}&workoutTaskExerciseId=${workoutTaskExercises[0].workout_task_exercise_id}`,
          {
            headers: {
              Cookie: cookie,
            },
          }
        );
        expect(response.status).toBe(200);
      });

      it('responds with 400 cannot remove exercise from task (task cannot be empty)', async function () {
        const workoutId = await createTestWorkout(accountId);
        const session = await createTestSessionOnWorkout(workoutId, accountId);
        const { workout_task_id, workoutTaskExercises } =
          await connectExerciseToWorkout(exercises[0].exercise_id!, workoutId);
        await updateWorkoutTaskOrder({
          taskOrder: JSON.stringify([workout_task_id]),
          workoutId,
        });
        const currentExerciseId = exercises[0].exercise_id;
        const response = await axiosAPIClient.delete(
          `/sessions/${session.session_id}/exercises/${currentExerciseId}?workoutId=${workoutId}&workoutTaskExerciseId=${workoutTaskExercises[0].workout_task_exercise_id}`,
          {
            headers: {
              Cookie: cookie,
            },
          }
        );
        expect(response.status).toBe(400);
      });
    });

    describe('That has sessions', () => {
      it('responds with 400 if tasks have only 1 exercise (cannot have empty task)', async function () {
        const workoutId = await createTestWorkout(accountId);
        await createTestSessionOnWorkout(workoutId, accountId);
        const secondSession = await createTestSessionOnWorkout(
          workoutId,
          accountId
        );
        const { workout_task_id, workoutTaskExercises } =
          await connectExerciseToWorkout(exercises[0].exercise_id!, workoutId);
        await updateWorkoutTaskOrder({
          taskOrder: JSON.stringify([workout_task_id]),
          workoutId,
        });
        const currentExerciseId = exercises[0].exercise_id;
        const response = await axiosAPIClient.delete(
          `/sessions/${secondSession.session_id}/exercises/${currentExerciseId}?workoutId=${workoutId}&workoutTaskExerciseId=${workoutTaskExercises[0].workout_task_exercise_id}`,
          {
            headers: {
              Cookie: cookie,
            },
          }
        );
        expect(response.status).toBe(400);
      });

      it('responds with 200 if cloned workout successfully and removing exercise from the task', async function () {
        const workoutId = await createTestWorkout(accountId);
        await createTestSessionOnWorkout(workoutId, accountId);
        const secondSession = await createTestSessionOnWorkout(
          workoutId,
          accountId
        );
        const { workout_task_id, workoutTaskExercises } =
          await connectManyExercisesToWorkout(
            [
              {
                exercise_id: exercises[0].exercise_id!,
              },
              {
                exercise_id: exercises[1].exercise_id!,
              },
            ],
            workoutId
          );
        await updateWorkoutTaskOrder({
          taskOrder: JSON.stringify([workout_task_id]),
          workoutId,
        });
        const currentExerciseId = exercises[0].exercise_id;
        const response = await axiosAPIClient.delete(
          `/sessions/${secondSession.session_id}/exercises/${currentExerciseId}?workoutId=${workoutId}&workoutTaskExerciseId=${workoutTaskExercises[0].workout_task_exercise_id}`,
          {
            headers: {
              Cookie: cookie,
            },
          }
        );
        expect(response.status).toBe(200);
      });
    });
  });
});
