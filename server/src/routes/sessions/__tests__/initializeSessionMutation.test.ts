import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';
import { sessions_table } from 'utils/databaseTypes';

describe('Initialize Session API', function () {
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

  describe('Initialize a session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.post('/sessions/init');
      expect(response.status).toBe(401);
    });

    it('responds with 422 if invalid / missing body', async () => {
      const response = await axiosAPIClient.post(
        '/sessions/init',
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(422);
    });

    it('responds with 201 when successful', async function () {
      const sessionDate = faker.date.recent().toISOString();
      const response = await axiosAPIClient.post(
        `/sessions/init`,
        {
          session_dt: sessionDate,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(201);
      expect(response.data.session).toMatchObject({
        completed: false,
        workout_id: expect.any(String),
        session_dt: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        created_by: accountId,
        deload: false,
        ended_at: null,
        readiness_energy: null,
        readiness_mood: null,
        readiness_sleep: null,
        readiness_soreness: null,
        readiness_stress: null,
        session_id: expect.any(String),
        started_at: null,
      } as Required<sessions_table>);
    });
  });
});
