import axios, { AxiosInstance } from 'axios';
import { createTestSession } from 'test/helpers/session';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Retrieve Task API', function () {
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

  describe('Fetches a task', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get(
        '/sessions/not-found/tasks/not-found'
      );
      expect(response.status).toBe(401);
    });

    it('responds with 403 when id not owned by user', async function () {
      const session = await createTestSession('-1');
      const response = await axiosAPIClient.get(
        `/sessions/${session.session_id}/tasks/not-found`,

        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(403);
    });

    it('responds with 404 when no task found', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.get(
        `/sessions/${session.session_id}/tasks/-1`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(404);
    });

    it('responds with 200 successfully retrieves the first task with correct values', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.get(
        `/sessions/${session.session_id}/tasks/${session.workoutTaskIds[0]}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject({
        status: 'success',
        message: 'Task fetched successfully',
        role: 'user',
        task: expect.any(Array),
        record: null,
        exerciseIds: expect.any(Array),
        next: expect.any(Object),
        prev: expect.any(Object),
      });

      // expect 2 exercises within the first task
      expect(response.data.task.length).toBe(2);
      expect(response.data.next.order.workoutTaskId).toBe(
        response.data.task[0]['task_order'][1]
      );

      expect(response.data.prev.order.workoutTaskId).toBe(undefined);
    });

    it('responds with 200 successfully retrieves the second task with correct values', async function () {
      const session = await createTestSession(accountId);
      const response = await axiosAPIClient.get(
        `/sessions/${session.session_id}/tasks/${session.workoutTaskIds[1]}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject({
        status: 'success',
        message: 'Task fetched successfully',
        role: 'user',
        task: expect.any(Array),
        record: null,
        exerciseIds: expect.any(Array),
        next: expect.any(Object),
        prev: expect.any(Object),
      });

      // expect 1 exercise within the second task
      expect(response.data.task.length).toBe(1);
      expect(response.data.next.order.workoutTaskId).toBe(undefined);
      expect(response.data.prev.order.workoutTaskId).toBe(
        response.data.task[0]['task_order'][0]
      );
    });
  });
});
