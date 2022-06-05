import axios, { AxiosInstance } from 'axios';
import { createTestExercise } from 'test/helpers/exercise';
import { createTestMuscleGroup } from 'test/helpers/muscle-group';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Exercise Muscle-Groups API', function () {
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

  describe('Adding a muscle-group to an exercise', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.post(`/exercises/1/muscle-group`);
      expect(response.status).toBe(401);
    });

    it('responds with 404 if exercise doesn`t exist', async function () {
      const response = await axiosAPIClient.post(
        `/exercises/not-found/muscle-group`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(404);
    });

    it('responds with 422 if no / invalid body', async function () {
      const exercise = await createTestExercise(accountId);
      const response = await axiosAPIClient.post(
        `/exercises/${exercise.exercise_id}/muscle-group`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(422);
    });

    it('responds with 201 success with primary group', async function () {
      const mg = await createTestMuscleGroup();
      const exercise = await createTestExercise(accountId);
      const response = await axiosAPIClient.post(
        `/exercises/${exercise.exercise_id}/muscle-group`,
        {
          group: 'primary',
          muscleGroupId: mg.muscle_group_id,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(201);
    });

    it('responds with 201 success with secondary group', async function () {
      const mg = await createTestMuscleGroup();
      const exercise = await createTestExercise(accountId);
      const response = await axiosAPIClient.post(
        `/exercises/${exercise.exercise_id}/muscle-group`,
        {
          group: 'secondary',
          muscleGroupId: mg.muscle_group_id,
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

  describe('Remove a muscle-group from an exercise', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.delete(
        `/exercises/1/muscle-group/1/primary`
      );
      expect(response.status).toBe(401);
    });

    it('responds with 403 if exercise is unaccessable to user', async function () {
      const mg = await createTestMuscleGroup();
      const exercise = await createTestExercise('-1');
      const response = await axiosAPIClient.delete(
        `/exercises/${exercise.exercise_id}/muscle-group/${mg.muscle_group_id}/primary`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(403);
    });

    it('responds with 404 if exercise does not exist', async function () {
      const response = await axiosAPIClient.delete(
        `/exercises/not-found/muscle-group/not-found/primary`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(404);
    });

    it('responds with 200 successfully deleted primary muscle-group from exercise', async function () {
      const mg = await createTestMuscleGroup();
      const exercise = await createTestExercise(accountId);
      await axiosAPIClient.post(
        `/exercises/${exercise.exercise_id}/muscle-group`,
        {
          group: 'primary',
          muscleGroupId: mg.muscle_group_id,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const response = await axiosAPIClient.delete(
        `/exercises/${exercise.exercise_id}/muscle-group/${mg.muscle_group_id}/primary`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(200);
    });

    it('responds with 200 successfully deleted secondary muscle-group from exercise', async function () {
      const mg = await createTestMuscleGroup();
      const exercise = await createTestExercise(accountId);
      await axiosAPIClient.post(
        `/exercises/${exercise.exercise_id}/muscle-group`,
        {
          group: 'secondary',
          muscleGroupId: mg.muscle_group_id,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      const response = await axiosAPIClient.delete(
        `/exercises/${exercise.exercise_id}/muscle-group/${mg.muscle_group_id}/secondary`,
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
