import axios, { AxiosInstance } from 'axios';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Delete Session API', function () {
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

  describe('Deleting a session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.delete('/sessions/not-found');
      expect(response.status).toBe(401);
    });

    it('responds with 404 if invalid sessionId', async function () {
      const response = await axiosAPIClient.delete(
        '/sessions/invalid-session-id',
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(404);
    });

    it('responds with 403 when id not owned by user', async function () {
      const session = await createTestSession('-1');
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 200 when successfully deleted', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}`,
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
