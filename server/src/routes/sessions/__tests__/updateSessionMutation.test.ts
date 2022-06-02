import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';
import { sessions_table } from 'utils/databaseTypes';

describe('Update Session API', function () {
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

  describe('Updating a session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.patch('/sessions/not-found');
      expect(response.status).toBe(401);
    });

    it('responds with 404 if invalid sessionId', async function () {
      const response = await axiosAPIClient.patch(
        '/sessions/invalid-session-id',
        {},
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
      const response = await axiosAPIClient.patch(
        `/sessions/${session.session_id}`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 422 when id not owned by user', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.patch(
        `/sessions/${session.session_id}`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(422);
    });

    it('responds with 200 when successfully updated', async function () {
      const session = await createTestSession(accountId);
      const body = {
        started_at: faker.date.past(),
        ended_at: faker.date.past(),
        session_dt: faker.date.past(),
        deload: true,
        readiness_energy: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
        readiness_mood: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
        readiness_stress: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
        readiness_soreness: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
        readiness_sleep: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
      };
      const response = await axiosAPIClient.patch(
        `/sessions/${session.session_id}`,
        body,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.session).toMatchObject({
        ...body,
        started_at: expect.any(String),
        ended_at: expect.any(String),
        session_dt: expect.any(String),
      } as Required<sessions_table>);
    });
  });
});
