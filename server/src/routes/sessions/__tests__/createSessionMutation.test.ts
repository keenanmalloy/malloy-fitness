import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { createTestWorkout } from 'test/helpers/workout';
import { initializeWebServer, stopWebServer } from 'test/server';
import { sessions_table } from 'utils/databaseTypes';

describe('Create Session API', function () {
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

  describe('Creating a session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.post('/sessions/');
      expect(response.status).toBe(401);
    });

    it('responds with 422 if invalid / missing body', async () => {
      const response = await axiosAPIClient.post(
        '/sessions/',
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
      const workoutId = await createTestWorkout(accountId);
      const response = await axiosAPIClient.post(
        `/sessions/`,
        {
          session_dt: faker.date.recent().toISOString(),
          workout_id: workoutId,
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
        workout_id: workoutId,
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
