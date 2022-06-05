import axios, { AxiosInstance } from 'axios';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('End Session API', function () {
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

  describe('Ending a session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.patch('/sessions/not-found/end');
      expect(response.status).toBe(401);
    });

    it('responds with 403 when resource not owned by user', async function () {
      const session = await createTestSession('-1');
      const response = await axiosAPIClient.patch(
        `/sessions/${session.session_id}/end`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 404 when no sets have yet been updated', async function () {
      const response = await axiosAPIClient.patch(
        `/sessions/not-found/end`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(404);
    });

    it('responds with 200 successfully found the last set updated', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.patch(
        `/sessions/${session.session_id}/end`,
        {},
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
