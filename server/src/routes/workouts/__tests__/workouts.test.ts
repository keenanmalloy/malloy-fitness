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
    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(1);
    expect(response.data[0]).toHaveProperty('id');
    expect(response.data[0]).toHaveProperty('name');
    expect(response.data[0]).toHaveProperty('description');
    expect(response.data[0]).toHaveProperty('exercises');
    expect(response.data[0]).toHaveProperty('createdAt');
    expect(response.data[0]).toHaveProperty('updatedAt');
  });
});
