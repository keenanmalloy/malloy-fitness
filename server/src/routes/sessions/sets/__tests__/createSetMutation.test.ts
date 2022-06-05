import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import {
  createTestSession,
  createTestSessionWithSets,
} from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Create Set API', function () {
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

  describe('Create a set', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.post('/sessions/not-found/sets');
      expect(response.status).toBe(401);
    });

    it('responds with 403 when id not owned by user', async function () {
      const session = await createTestSession('-1');
      const response = await axiosAPIClient.post(
        `/sessions/${session.session_id}/sets`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 422 when missing / invalid body', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.post(
        `/sessions/${session.session_id}/sets`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(422);
    });

    it('responds with 201 when set is successfully created', async function () {
      const session = await createTestSessionWithSets(accountId);
      const response = await axiosAPIClient.post(
        `/sessions/${session.session_id}/sets`,
        {
          exercise_id: session['exerciseIds'][1],
          weight: faker.datatype.number({
            max: 300,
            min: 50,
          }),
          repetitions: faker.datatype.number({
            max: 20,
            min: 2,
          }),
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
