import axios, { AxiosInstance } from 'axios';
import {
  createTestExercise,
  deleteAllTestExercises,
} from 'test/helpers/exercise';
import { deleteAllTestSets } from 'test/helpers/sets';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';
import { exercises_table } from 'utils/databaseTypes';

describe('Exercises API', function () {
  let axiosAPIClient: AxiosInstance;
  let cookie: string;
  let accountId: string;
  let exerciseIds: exercises_table[];

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
    await deleteAllTestSets();
    await deleteAllTestExercises();
    exerciseIds = await Promise.all([
      createTestExercise(accountId, {
        category: 'chest',
        profile: 'short',
        name: 'AAA',
        description: '111',
      }),
      createTestExercise(accountId, {
        category: 'legs',
        profile: 'mid',
        name: 'BBB',
        description: '222',
      }),
      createTestExercise(accountId, {
        category: 'back',
        profile: 'long',
        name: 'CCC',
        description: '333',
      }),
    ]);
  });

  afterAll(async () => {
    await stopWebServer();
  });

  describe('Fetching all exercises', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/exercises/');
      expect(response.status).toBe(401);
    });

    it('responds with a status of 200 and an array of exercises when successful', async function () {
      const response = await axiosAPIClient.get(`/exercises/`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data.exercises.length).toBe(3);
    });

    it('returns the category correctly', async function () {
      const response = await axiosAPIClient.get(`/exercises/?category=chest`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data.exercises.length).toBe(1);
      expect(response.data.exercises[0].category).toBe('chest');
    });

    it('returns the profile correctly', async function () {
      const response = await axiosAPIClient.get(`/exercises/?profile=mid`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data.exercises.length).toBe(1);
      expect(response.data.exercises[0].profile).toBe('mid');
    });

    it('search by name correctly', async function () {
      const response = await axiosAPIClient.get(`/exercises/?q=AAA`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data.exercises.length).toBe(1);
      expect(response.data.exercises[0].name).toBe('AAA');
    });

    it('search by description correctly', async function () {
      const response = await axiosAPIClient.get(`/exercises/?q=222`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data.exercises.length).toBe(1);
      expect(response.data.exercises[0].description).toBe('222');
    });

    it('search by ids correctly', async function () {
      const response = await axiosAPIClient.get(
        `/exercises/?ids=${exerciseIds[0].exercise_id},${exerciseIds[1].exercise_id}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(200);
      expect(
        response.data.exercises.some(
          (exercise: any) => exercise.exercise_id === exerciseIds[0].exercise_id
        )
      ).toBe(true);
      expect(
        response.data.exercises.some(
          (exercise: any) => exercise.exercise_id === exerciseIds[1].exercise_id
        )
      ).toBe(true);
      expect(
        response.data.exercises.some(
          (exercise: any) => exercise.exercise_id === exerciseIds[2].exercise_id
        )
      ).toBe(false);
    });
  });
});
