import axios, { AxiosInstance } from 'axios';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Logout', function () {
  let axiosAPIClient: AxiosInstance;

  beforeAll(async () => {
    const apiConnection = await initializeWebServer();
    const axiosConfig = {
      baseURL: `http://localhost:${apiConnection.port}`,
      validateStatus: () => true,
    };
    axiosAPIClient = axios.create(axiosConfig);
  });

  afterAll(async () => {
    await stopWebServer();
  });

  it('redirects to /login', async function () {
    const response = await axiosAPIClient.post('/auth/logout');
    expect(response.request.path).toBe('/login');
  });
});
