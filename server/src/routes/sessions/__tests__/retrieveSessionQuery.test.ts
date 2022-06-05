import axios, { AxiosInstance } from 'axios';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Session API', function () {
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

  describe('Fetching a session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/sessions/1');
      expect(response.status).toBe(401);
    });

    it('responds with 403 if unaccessable by user', async function () {
      const { session_id } = await createTestSession('-1');
      const response = await axiosAPIClient.get(`/sessions/${session_id}`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(403);
    });

    it('responds with 404 if not found', async () => {
      const response = await axiosAPIClient.get('/sessions/not-found', {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(404);
    });

    it('responds with 200 when successful', async function () {
      const { session_id, workout_id, session_dt } = await createTestSession(
        accountId
      );
      const response = await axiosAPIClient.get(`/sessions/${session_id}`, {
        headers: {
          Cookie: cookie,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.session).toMatchObject({
        session_id,
        workout_id,
        session_dt: session_dt && new Date(session_dt).toISOString(),
      });
    });
  });
});
