import axios, { AxiosInstance } from 'axios';
import { initializeWebServer } from 'test/server';

let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  const apiConnection: any = await initializeWebServer();
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true,
  };
  axiosAPIClient = axios.create(axiosConfig);
});

describe('POST /exercises/:pk/muscle-group', function () {
  it('responds with 401 Unauthenticated', async function () {
    const response = await axiosAPIClient.post(`/exercises/1/muscle-group`);
    expect(response.status).toBe(401);
    expect(response.data).toEqual({ status: 'Unauthorized' });
  });

  it('responds with 422 unprocessable entity', async function () {
    const response = await axiosAPIClient.post(`/exercises/1/muscle-group`, {});
    expect(response.status).toBe(422);
    expect(response.data).toEqual({ status: 'Unprocessable Entity' });
  });

  it('responds with 201 success with primary group', async function () {
    const response = await axiosAPIClient.post(`/exercises/1/muscle-group`, {
      primaryGroup: 1,
    });
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ status: 'Created' });
  });

  it('responds with 201 success with secondary group', async function () {
    const response = await axiosAPIClient.post(`/exercises/1/muscle-group`, {
      secondaryGroup: 1,
    });
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ status: 'Created' });
  });
});

describe('DELETE /exercises/:pk/muscle-group/:pk/primary', function () {
  it('responds with 401 Unauthenticated', async function () {
    const response = await axiosAPIClient.delete(
      `/exercises/1/muscle-group/1/primary`
    );
    expect(response.status).toBe(401);
    expect(response.data).toEqual({ status: 'Unauthorized' });
  });

  it('responds with 403 Unauthorized', async function () {
    const response = await axiosAPIClient.delete(
      `/exercises/1/muscle-group/1/primary`
    );
    expect(response.status).toBe(403);
    expect(response.data).toEqual({ status: 'Forbidden' });
  });

  it('responds with 200 successfully deleted', async function () {
    const response = await axiosAPIClient.delete(
      `/exercises/1/muscle-group/1/primary`
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ status: 'OK' });
  });

  it('responds with 404 not found', async function () {
    const response = await axiosAPIClient.delete(
      `/exercises/1/muscle-group/1/primary`
    );
    expect(response.status).toBe(404);
    expect(response.data).toEqual({ status: 'Not Found' });
  });
});

describe('DELETE /exercises/:pk/muscle-group/:pk/secondary', function () {
  it('responds with 401 Unauthenticated', async function () {
    const response = await axiosAPIClient.delete(
      `/exercises/1/muscle-group/1/secondary`
    );
    expect(response.status).toBe(401);
    expect(response.data).toEqual({ status: 'Unauthorized' });
  });

  it('responds with 403 Unauthorized', async function () {
    const response = await axiosAPIClient.delete(
      `/exercises/1/muscle-group/1/secondary`
    );
    expect(response.status).toBe(403);
    expect(response.data).toEqual({ status: 'Forbidden' });
  });

  it('responds with 200 successfully deleted', async function () {
    const response = await axiosAPIClient.delete(
      `/exercises/1/muscle-group/1/secondary`
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ status: 'OK' });
  });

  it('responds with 404 not found', async function () {
    const response = await axiosAPIClient.delete(
      `/exercises/1/muscle-group/1/secondary`
    );
    expect(response.status).toBe(404);
    expect(response.data).toEqual({ status: 'Not Found' });
  });
});
