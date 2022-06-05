import axios, { AxiosInstance } from 'axios';
import { querySessionById } from 'queries/sessions';
import { createTestExercise } from 'test/helpers/exercise';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { createFullTestWorkout } from 'test/helpers/workout';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Remove Task API', function () {
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

  describe('Removes a task from the session', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.delete(
        '/sessions/not-found/tasks/not-found'
      );
      expect(response.status).toBe(401);
    });

    it('responds with 403 when id not owned by user', async function () {
      const session = await createTestSession('-1');
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/tasks/not-found?workoutId=not-found`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 404 when no workout found', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/tasks/-1?workoutId=-1`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(404);
    });

    it('responds with 400 when missing workoutId query param ?workoutId=""', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/tasks/${session.workoutTaskIds[0]}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(400);
    });

    it('responds with 200 when successfully deleting a task from an unmarked workout', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.delete(
        `/sessions/${session.session_id}/tasks/${session.workoutTaskIds[0]}?workoutId=${session.workout_id}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(200);

      const initialTaskOrder = session.workout.task_order;
      const sessionAfter = await querySessionById(session.session_id);
      const newTaskOrder = sessionAfter.task_order;

      // Check that the task_order on the workout has been updated accordingly
      expect(newTaskOrder).toEqual(
        initialTaskOrder.filter((id) => id !== response.data.taskId)
      );
    });

    it('responds with 200 when successfully cloning the workout and then removing the task', async function () {
      const { workoutId, workout } = await createFullTestWorkout(accountId);

      const firstSession = await createTestSession(accountId, { workoutId });
      const secondSession = await createTestSession(accountId, { workoutId });
      const response = await axiosAPIClient.delete(
        `/sessions/${firstSession.session_id}/tasks/${workout.task_order[0]}?workoutId=${firstSession.workout_id}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(200);

      const sessionAfter = await querySessionById(firstSession.session_id);
      const newTaskOrder = sessionAfter.task_order;

      // Check that the task_order on the workout has been updated accordingly
      expect(newTaskOrder.length).toEqual(1);
    });
  });
});
