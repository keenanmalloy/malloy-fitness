import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import {
  createTestSession,
  createTestSessionWithSets,
} from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Update Set API', function () {
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

  describe('Update a set', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.put(
        '/sessions/not-found/sets/not-found'
      );
      expect(response.status).toBe(401);
    });

    it('responds with 403 when id not owned by user', async function () {
      const session = await createTestSessionWithSets('-1');
      const response = await axiosAPIClient.put(
        `/sessions/${session.session_id}/sets/-1`,
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
      const session = await createTestSessionWithSets(accountId);
      const response = await axiosAPIClient.put(
        `/sessions/${session.session_id}/sets/${session.setIds[0]}`,
        {
          weight: 0,
          repetitions: 0,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(422);
    });

    it('responds with 404 when set does not exist', async function () {
      const session = await createTestSessionWithSets(accountId);
      const response = await axiosAPIClient.put(
        `/sessions/${session.session_id}/sets/-1`,
        {
          weight: 222,
          repetitions: 22,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(404);
    });

    it('responds with 200 when set is successfully created', async function () {
      const session = await createTestSessionWithSets(accountId);
      const response = await axiosAPIClient.put(
        `/sessions/${session.session_id}/sets/${session.setIds[0]}`,
        {
          weight: 222,
          repetitions: 22,
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
});
