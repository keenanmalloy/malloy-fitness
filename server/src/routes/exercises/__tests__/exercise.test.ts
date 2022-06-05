import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import {
  EXERCISE_CATEGORIES,
  EXERCISE_PROFILES,
  EXERCISE_TRACKERS,
  EXERCISE_TYPES,
} from 'test/helpers/env';
import { createTestExercise } from 'test/helpers/exercise';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Exercise API', function () {
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

  describe('Fetching a single exercise', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/exercises');
      expect(response.status).toBe(401);
    });

    it('responds with 404 when not found', async function () {
      const response = await axiosAPIClient.get(`/exercises/not-found`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(404);
    });

    it('responds with 200 when successful', async function () {
      const exercise = await createTestExercise(accountId);
      const response = await axiosAPIClient.get(
        `/exercises/${exercise.exercise_id}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(200);
    });
  });

  describe('Creating a single exercise', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.post('/exercises');
      expect(response.status).toBe(401);
    });

    it('responds with 422 if it cannot process the body', async function () {
      const response = await axiosAPIClient.post(
        '/exercises',
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(422);
    });

    it('responds with 201 if successful', async function () {
      const response = await axiosAPIClient.post(
        '/exercises',
        {
          name: faker.random.word(),
          primaryTracker: faker.helpers.arrayElement(EXERCISE_TRACKERS),
          type: faker.helpers.arrayElement(EXERCISE_TYPES),
          category: faker.helpers.arrayElement(EXERCISE_CATEGORIES),
          description: faker.lorem.sentence(),
          profile: faker.helpers.arrayElement(EXERCISE_PROFILES),
          secondaryTracker: faker.helpers.arrayElement(EXERCISE_TRACKERS),
          video: faker.internet.url(),
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

  describe('Updating a single exercise', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.put('/exercises/not-found');
      expect(response.status).toBe(401);
    });

    it('responds with 403 if unaccessable by the active user', async function () {
      const exercise = await createTestExercise('-1');
      const response = await axiosAPIClient.put(
        `/exercises/${exercise.exercise_id}`,
        {
          name: 'UPDATED',
          description: 'UPDATED',
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(403);
    });

    it('responds with 422 unprocessable entity', async function () {
      const exercise = await createTestExercise(accountId);
      const response = await axiosAPIClient.put(
        `/exercises/${exercise.exercise_id}`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(422);
    });

    it('responds with 200 successfully updated', async function () {
      const exercise = await createTestExercise(accountId);
      const response = await axiosAPIClient.put(
        `/exercises/${exercise.exercise_id}`,
        {
          name: 'UPDATED',
          description: 'UPDATED',
          primary_tracker: faker.helpers.arrayElement(EXERCISE_TRACKERS),
          secondary_tracker: faker.helpers.arrayElement(EXERCISE_TRACKERS),
          type: faker.helpers.arrayElement(EXERCISE_TYPES),
          category: faker.helpers.arrayElement(EXERCISE_CATEGORIES),
          profile: faker.helpers.arrayElement(EXERCISE_PROFILES),
          video: faker.internet.url(),
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(200);
    });
  });

  describe('Deleting an exercise', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.delete('/exercises/1');
      expect(response.status).toBe(401);
    });

    it('responds with 404 if exercise does not exist', async function () {
      const response = await axiosAPIClient.delete(`/exercises/not-found`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(404);
    });

    it('responds with 403 Unauthorized', async function () {
      const exercise = await createTestExercise('-1');
      const response = await axiosAPIClient.delete(
        `/exercises/${exercise.exercise_id}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(403);
    });

    it('responds with 200 - successfully deleted', async function () {
      const exercise = await createTestExercise(accountId);
      const response = await axiosAPIClient.delete(
        `/exercises/${exercise.exercise_id}`,
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
