import axios, { AxiosInstance } from 'axios';
import { initializeWebServer } from 'test/server';

// Configuring file-level HTTP client with base URL will allow
// all the tests to approach with a shortened syntax
let axiosAPIClient: AxiosInstance;

beforeAll(async () => {
  // ️️️✅ Best Practice: Place the backend under test within the same process
  const apiConnection: any = await initializeWebServer();
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}`,
    validateStatus: () => true, //Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
  };
  axiosAPIClient = axios.create(axiosConfig);
});

describe('GET /health', function () {
  it('responds with OK', async function () {
    const response = await axiosAPIClient.get('/health');
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ status: 'OK' });
  });
});

describe('GET non existant-route', function () {
  it('responds with 404', async function () {
    const response = await axiosAPIClient.get('/non-existant-route');
    expect(response.status).toBe(404);
    expect(response.data).toEqual({ status: 'Not Found' });
  });
});
