import axios, { AxiosInstance } from 'axios';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Sessions API', function () {
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

    await Promise.all([
      await createTestSession(accountId),
      await createTestSession(accountId),
      await createTestSession(accountId),
      await createTestSession(accountId),
      await createTestSession(accountId),
    ]);
  });

  afterAll(async () => {
    await stopWebServer();
  });

  describe('Fetching sessions', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/sessions/');
      expect(response.status).toBe(401);
    });

    it('response with 200 if fetches the sessions successfully', async function () {
      const response = await axiosAPIClient.get(`/sessions`, {
        headers: {
          Cookie: cookie,
        },
      });

      expect(response.status).toBe(200);
    });
  });
});
