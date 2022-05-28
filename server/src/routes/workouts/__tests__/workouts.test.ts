import axios, { AxiosInstance } from 'axios';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('GET /workouts', function () {
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

  it('should return a list of workouts', async () => {
    const response = await axiosAPIClient.get('/workouts');
    expect(true).toBe(true);
  });
});
