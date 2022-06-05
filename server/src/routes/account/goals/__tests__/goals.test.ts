import axios, { AxiosInstance } from 'axios';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Goals API', function () {
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

  describe('Fetching settings about goals', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/account/goals/');
      expect(response.status).toBe(401);
    });

    it('responds with 200 when successfully retrieves goals', async function () {
      const response = await axiosAPIClient.get(`/account/goals/`, {
        headers: {
          Cookie: cookie,
        },
      });

      expect(response.status).toBe(200);
      expect(typeof response.data.goals.daily_steps_goal === 'number').toBe(
        true
      );
      expect(
        typeof response.data.goals.weekly_cardio_minutes_goal === 'number'
      ).toBe(true);
    });
  });

  describe('Updating settings about goals', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.patch('/account/goals/');
      expect(response.status).toBe(401);
    });

    it('responds with 422 when missing / invalid body', async function () {
      const response = await axiosAPIClient.patch(
        `/account/goals/`,
        { daily_steps_goal: 'invalid' },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(422);
    });

    it('responds with 200 when sucessful request to update', async function () {
      const response = await axiosAPIClient.patch(
        `/account/goals/`,
        {
          daily_steps_goal: 10000,
          weekly_cardio_minutes_goal: 200,
          body_weight_goal: 160,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.goals.daily_steps_goal).toBe(10000);
      expect(response.data.goals.weekly_cardio_minutes_goal).toBe(200);
      expect(response.data.goals.body_weight_goal).toBe(160);
    });
  });
});
