import axios, { AxiosInstance } from 'axios';
import {
  createTestSession,
  createTestSessionWithSets,
} from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Get Sets By Exercise API', function () {
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

  describe('Fetch sets by exercise', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get(
        '/sessions/not-found/exercise/not-found/sets'
      );
      expect(response.status).toBe(401);
    });

    it('responds with 403 when id not owned by user', async function () {
      const session = await createTestSession('-1');
      const response = await axiosAPIClient.get(
        `/sessions/${session.session_id}/exercise/1/sets`,

        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 200 with all sets logged with the exercise', async function () {
      const session = await createTestSessionWithSets(accountId);
      const response = await axiosAPIClient.get(
        `/sessions/${session.session_id}/exercise/${session.exerciseIds[0]}/sets`,
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
