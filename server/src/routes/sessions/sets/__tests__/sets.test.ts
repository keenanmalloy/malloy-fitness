import axios, { AxiosInstance } from 'axios';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Session Exercises', function () {
  let axiosAPIClient: AxiosInstance;

  beforeAll(async () => {
    const apiConnection: any = await initializeWebServer();
    const axiosConfig = {
      baseURL: `http://127.0.0.1:${apiConnection.port}`,
      validateStatus: () => true,
    };
    axiosAPIClient = axios.create(axiosConfig);
  });

  afterAll(async () => {
    await stopWebServer();
  });

  describe('GET /workouts/:pk/exercise/:pk/sets', function () {
    it('responds with 401 unauthorized', async function () {
      const response = await axiosAPIClient.get(`/workouts/1/exercise/1/sets`);
      expect(response.status).toBe(401);
    });

    it('responds with 403 forbidden', async function () {
      const response = await axiosAPIClient.get(`/workouts/1/exercise/1/sets`, {
        headers: {
          Authorization: 'Bearer invalid',
        },
      });
      expect(response.status).toBe(403);
    });

    it('responds with 200 fetched all sets by exercise', async function () {
      const response = await axiosAPIClient.get(`/workouts/1/exercise/1/sets`, {
        headers: {
          Authorization: 'Bearer valid',
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });
  });

  describe('GET /workouts/:pk/sets', function () {
    it('responds with 401 unauthorized', async function () {
      const response = await axiosAPIClient.get(`/workouts/1/sets`);
      expect(response.status).toBe(401);
    });

    it('responds with 403 forbidden', async function () {
      const response = await axiosAPIClient.get(`/workouts/1/sets`, {
        headers: {
          Authorization: 'Bearer invalid',
        },
      });
      expect(response.status).toBe(403);
    });

    it('responds with 200 fetched all sets by workout', async function () {
      const response = await axiosAPIClient.get(`/workouts/1/sets`, {
        headers: {
          Authorization: 'Bearer valid',
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });
  });

  describe('POST /workouts/:pk/sets', function () {
    it('responds with 401 unauthorized', async function () {
      const response = await axiosAPIClient.post(`/workouts/1/sets`);
      expect(response.status).toBe(401);
    });

    it('responds with 403 forbidden', async function () {
      const response = await axiosAPIClient.post(
        `/workouts/1/sets`,
        {},
        {
          headers: {
            Authorization: 'Bearer invalid',
          },
        }
      );
      expect(response.status).toBe(403);
    });

    it('responds with 422 unprocessable entity', async function () {
      const response = await axiosAPIClient.post(
        `/workouts/1/sets`,
        {},
        {
          headers: {
            Authorization: 'Bearer valid',
          },
        }
      );
      expect(response.status).toBe(422);
    });

    it('responds with 200 set recorded', async function () {
      const response = await axiosAPIClient.post(
        `/workouts/1/sets`,
        {
          reps: 5,
          weight: 100,
        },
        {
          headers: {
            Authorization: 'Bearer valid',
          },
        }
      );
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });
  });

  describe('PUT /workouts/:pk/sets/:pk', function () {
    it('responds with 401 Unauthenticated', async function () {
      const response = await axiosAPIClient.put(`/workouts/1/sets/1`);
      expect(response.status).toBe(401);
    });

    it('responds with 403 Unauthorized', async function () {
      const response = await axiosAPIClient.put(
        `/workouts/1/sets/1`,
        {},
        {
          headers: {
            Authorization: 'Bearer invalid',
          },
        }
      );
      expect(response.status).toBe(403);
    });

    it('responds with 422 unprocessable entity', async function () {
      const response = await axiosAPIClient.put(
        `/workouts/1/sets/1`,
        {},
        {
          headers: {
            Authorization: 'Bearer valid',
          },
        }
      );
      expect(response.status).toBe(422);
    });

    it('responds with 200 successfully updated', async function () {
      const response = await axiosAPIClient.put(
        `/workouts/1/sets/1`,
        {
          reps: 5,
          weight: 100,
        },
        {
          headers: {
            Authorization: 'Bearer valid',
          },
        }
      );
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });

    it('responds with 404 not found', async function () {
      const response = await axiosAPIClient.put(
        `/workouts/1/sets/1`,
        {
          reps: 5,
          weight: 100,
        },
        {
          headers: {
            Authorization: 'Bearer valid',
          },
        }
      );
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /workouts/:pk/exercise/:pk/sets', function () {
    it('responds with 401 Unauthenticated', async function () {
      const response = await axiosAPIClient.delete(
        `/workouts/1/exercise/1/sets`
      );
      expect(response.status).toBe(401);
    });

    it('responds with 403 Unauthorized', async function () {
      const response = await axiosAPIClient.delete(
        `/workouts/1/exercise/1/sets`,
        {
          headers: {
            Authorization: 'Bearer invalid',
          },
        }
      );
      expect(response.status).toBe(403);
    });

    it('responds with 200 successfully deleted', async function () {
      const response = await axiosAPIClient.delete(
        `/workouts/1/exercise/1/sets`,
        {
          headers: {
            Authorization: 'Bearer valid',
          },
        }
      );
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });

    it('responds with 404 not found', async function () {
      const response = await axiosAPIClient.delete(
        `/workouts/1/exercise/1/sets`,
        {
          headers: {
            Authorization: 'Bearer valid',
          },
        }
      );
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /workouts/:pk/sets/:pk', function () {
    it('responds with 401 Unauthenticated', async function () {
      const response = await axiosAPIClient.delete(`/workouts/1/sets/1`);
      expect(response.status).toBe(401);
    });

    it('responds with 403 Unauthorized', async function () {
      const response = await axiosAPIClient.delete(`/workouts/1/sets/1`, {
        headers: {
          Authorization: 'Bearer invalid',
        },
      });
      expect(response.status).toBe(403);
    });

    it('responds with 200 successfully deleted', async function () {
      const response = await axiosAPIClient.delete(`/workouts/1/sets/1`, {
        headers: {
          Authorization: 'Bearer valid',
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });

    it('responds with 404 not found', async function () {
      const response = await axiosAPIClient.delete(`/workouts/1/sets/1`, {
        headers: {
          Authorization: 'Bearer valid',
        },
      });
      expect(response.status).toBe(404);
    });
  });
});
