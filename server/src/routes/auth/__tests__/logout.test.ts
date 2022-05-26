import axios, { AxiosInstance } from 'axios';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('POST /auth/logout', function () {
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

  it('responds with 302 redirected to /login', async function () {
    const response = await axiosAPIClient.post('/auth/logout');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });
});
