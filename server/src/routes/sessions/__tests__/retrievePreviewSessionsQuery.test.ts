import axios, { AxiosInstance } from 'axios';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Sessions Preview API', function () {
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
      await createTestSession(accountId, {
        date: '2022-03-30',
      }),
      await createTestSession(accountId, {
        date: '2022-04-30',
      }),
      await createTestSession(accountId, {
        date: '2022-05-30',
      }),
      await createTestSession(accountId, {
        date: '2022-06-30',
      }),
      await createTestSession(accountId, {
        date: '2022-07-30',
      }),
    ]);
  });

  afterAll(async () => {
    await stopWebServer();
  });

  describe('Fetching preview sessions', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/sessions/preview');
      expect(response.status).toBe(401);
    });

    it('responds with 400 if missing Date', async function () {
      const response = await axiosAPIClient.get('/sessions/preview', {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(400);
    });

    it('returns the sessions within a +/- 1 month time interval from the date param', async function () {
      const response = await axiosAPIClient.get(
        `/sessions/preview?date=${new Date('2022-05-30').toISOString()}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.sessions).toHaveLength(3);
      expect(response.data.sessions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            session_dt: new Date('2022-04-30').toISOString(),
          }),
          expect.objectContaining({
            session_dt: new Date('2022-05-30').toISOString(),
          }),
          expect.objectContaining({
            session_dt: new Date('2022-06-30').toISOString(),
          }),
        ])
      );
    });
  });
});
