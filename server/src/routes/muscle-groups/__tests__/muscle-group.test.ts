import axios, { AxiosInstance } from 'axios';
import { createTestMuscleGroup } from 'test/helpers/muscle-group';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('muscle-group API', function () {
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

  describe('Fetching a single muscle-group', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/muscle-groups');
      expect(response.status).toBe(401);
    });

    it('responds with 404 when not found', async function () {
      const response = await axiosAPIClient.get(`/muscle-groups/not-found`, {
        headers: {
          Cookie: cookie,
        },
      });
      expect(response.status).toBe(404);
    });

    it('responds with 200 when successful', async function () {
      const mg = await createTestMuscleGroup();
      const response = await axiosAPIClient.get(
        `/muscle-groups/${mg.muscle_group_id}`,
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
