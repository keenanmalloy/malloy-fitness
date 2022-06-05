import axios, { AxiosInstance } from 'axios';
import { querySetsBySession } from 'queries/sets';
import { createTestSessionWithSets } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Delete Set API', function () {
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

  describe('Delete a set', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.delete('/sessions/not-found');
      expect(response.status).toBe(401);
    });

    it('responds with 403 when id not owned by user', async function () {
      const session = await createTestSessionWithSets('-1');
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/sets/${session.setIds[0]}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 200 when set is successfully deleted', async function () {
      const session = await createTestSessionWithSets(accountId);
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/sets/${session.setIds[0]}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(200);
      const sets = await querySetsBySession(session.session_id);
      expect(sets.length).toBeLessThan(session.setIds.length);
    });
  });
});
