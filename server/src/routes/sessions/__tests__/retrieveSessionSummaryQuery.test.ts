import axios, { AxiosInstance } from 'axios';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Session Summary API', function () {
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

  describe('Fetching session summary', function () {
    it('responds with 401 if missing Cookie', async function () {
      const { session_id } = await createTestSession(accountId);
      const response = await axiosAPIClient.get(
        `/sessions/${session_id}/summary`
      );
      expect(response.status).toBe(401);
    });

    it('returns 200 when fetching the summary successfully', async function () {
      const { session_id } = await createTestSession(accountId);
      const response = await axiosAPIClient.get(
        `/sessions/${session_id}/summary`,
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
