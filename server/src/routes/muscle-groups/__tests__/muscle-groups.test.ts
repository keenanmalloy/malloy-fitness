import axios, { AxiosInstance } from 'axios';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('/muscle-groups', function () {
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

  describe('GET /muscle-groups', function () {
    it('responds with 200 successfully fetched list of muscle-groups', async function () {
      const response = await axiosAPIClient.get(`/muscle-groups`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });
  });

  describe('GET /muscle-groups/:pk', function () {
    it('responds with 200 successfully fetched workout', async function () {
      const response = await axiosAPIClient.get(`/muscle-groups/1`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });
  });

  describe('POST /muscle-groups/', function () {
    it('responds with 401 Unauthenticated', async function () {
      const response = await axiosAPIClient.post(`/muscle-groups`);
      expect(response.status).toBe(401);
    });

    it('responds with 422 unprocessable entity', async function () {
      const response = await axiosAPIClient.post(`/muscle-groups`, {});
      expect(response.status).toBe(422);
    });

    it('responds with 201 success', async function () {
      const response = await axiosAPIClient.post(`/muscle-groups`, {
        name: 'test',
      });
      expect(response.status).toBe(201);
      expect(response.data).toEqual({ status: 'Success' });
    });
  });

  describe('PUT /muscle-groups/:pk', function () {
    it('responds with 401 Unauthenticated', async function () {
      const response = await axiosAPIClient.put(`/muscle-groups/1`);
      expect(response.status).toBe(401);
    });

    it('responds with 422 unprocessable entity', async function () {
      const response = await axiosAPIClient.put(`/muscle-groups/1`, {});
      expect(response.status).toBe(422);
    });

    it('responds with 200 successfully updated', async function () {
      const response = await axiosAPIClient.put(`/muscle-groups/1`, {
        name: 'test',
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });
  });

  describe('DELETE /muscle-groups/:pk', function () {
    it('responds with 401 Unauthenticated', async function () {
      const response = await axiosAPIClient.delete(`/muscle-groups/1`);
      expect(response.status).toBe(401);
    });

    it('responds with 200 - successfully deleted', async function () {
      const response = await axiosAPIClient.delete(`/muscle-groups/1`);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ status: 'Success' });
    });
  });
});
