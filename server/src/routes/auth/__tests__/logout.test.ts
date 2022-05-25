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

describe('POST /auth/logout', function () {
  it('responds with 302 redirected to /login', async function () {
    const response = await axiosAPIClient.post('/auth/logout');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });
});
