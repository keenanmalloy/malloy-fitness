import axios, { AxiosInstance } from 'axios';
import {
  createTestSession,
  createTestSessionWithSets,
} from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Rotate Exercise in Session API', function () {
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

  describe('Rotating an exercise within a session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.put(
        '/sessions/not-found/exercises/:exerciseId'
      );
      expect(response.status).toBe(401);
    });

    it('responds with 403 when resource not owned by user', async function () {
      const session = await createTestSessionWithSets('-1');
      const response = await axiosAPIClient.put(
        `/sessions/${session.session_id}/exercises/${session.exerciseIds[0]}`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 404 when the exercise to be rotated does not exist', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.put(
        `/sessions/${session.session_id}/exercises/not-found`,
        {},
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(404);
    });

    it.skip('responds with 200 successfully found the last set updated', async function () {
      const session = await createTestSessionWithSets(accountId);
      const response = await axiosAPIClient.put(
        `/sessions/${session.session_id}/exercises/${session.exerciseIds[0]}`,
        {
          workoutId: session.workout_id,
          workoutTaskId: '',
          workoutTaskExerciseId: '',
        },
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
