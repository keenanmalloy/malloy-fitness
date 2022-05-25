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

describe('GET /exercises', function () {
  it('responds with 200 successfully fetched list of exercises', async function () {
    const response = await axiosAPIClient.get('/exercises');
    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(1);
    expect(response.data[0]).toHaveProperty('id');
    expect(response.data[0]).toHaveProperty('name');
    expect(response.data[0]).toHaveProperty('description');
    expect(response.data[0]).toHaveProperty('createdAt');
    expect(response.data[0]).toHaveProperty('updatedAt');
  });

  it('responds with 200 where query shows no results', async function () {
    const response = await axiosAPIClient.get(
      '/exercises?name=non-existant-exercise'
    );
    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(0);
  });
});

describe('GET /exercises/:pk', function () {
  it('responds with 200 successfully fetched list of exercises', async function () {
    const response = await axiosAPIClient.get('/exercises/1');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('description');
    expect(response.data).toHaveProperty('createdAt');
    expect(response.data).toHaveProperty('updatedAt');
  });
});

describe('POST /exercises/', function () {
  it('responds with 401 Unauthenticated', async function () {
    const response = await axiosAPIClient.post('/exercises');
    expect(response.status).toBe(401);
  });

  it('responds with 422 unprocessable entity', async function () {
    const response = await axiosAPIClient.post('/exercises', {});
    expect(response.status).toBe(422);
  });

  it('responds with 201 success', async function () {
    const response = await axiosAPIClient.post('/exercises', {
      name: 'test exercise',
      description: 'test description',
    });
    expect(response.status).toBe(201);
  });
});

describe('PUT /exercises/:exerciseId', function () {
  it('responds with 401 Unauthenticated', async function () {
    const response = await axiosAPIClient.put('/exercises/1');
    expect(response.status).toBe(401);
  });

  it('responds with 403 Unauthorized', async function () {
    const response = await axiosAPIClient.put('/exercises/1', {
      name: 'test exercise',
      description: 'test description',
    });
    expect(response.status).toBe(403);
  });

  it('responds with 422 unprocessable entity', async function () {
    const response = await axiosAPIClient.put('/exercises/1', {});
    expect(response.status).toBe(422);
  });

  it('responds with 200 successfully updated', async function () {
    const response = await axiosAPIClient.put('/exercises/1', {
      name: 'test exercise',
      description: 'test description',
    });
    expect(response.status).toBe(200);
  });
});

describe('DELETE /exercises/:pk', function () {
  it('responds with 401 Unauthenticated', async function () {
    const response = await axiosAPIClient.delete('/exercises/1');
    expect(response.status).toBe(401);
  });

  it('responds with 403 Unauthorized', async function () {
    const response = await axiosAPIClient.delete('/exercises/1');
    expect(response.status).toBe(403);
  });

  it('responds with 200 - successfully deleted', async function () {
    const response = await axiosAPIClient.delete('/exercises/1');
    expect(response.status).toBe(200);
  });
});
