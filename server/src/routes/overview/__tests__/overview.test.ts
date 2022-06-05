import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';
import nock from 'nock';

describe('Overview API', function () {
  let axiosAPIClient: AxiosInstance;
  let cookie: string;
  let accountId: string;

  // Create a one-time interceptor before every test
  beforeEach(() => {
    nock('http://localhost/user/').get(`/1`).reply(200, {
      id: 1,
      name: 'John',
    });
  });

  beforeAll(async () => {
    const apiConnection = await initializeWebServer();
    const axiosConfig = {
      baseURL: `http://localhost:${apiConnection.port}`,
      validateStatus: () => true,
    };
    axiosAPIClient = axios.create(axiosConfig);
    const user = await createAndAuthorizeUser();
    cookie = user.cookie;
    accountId = user.accountId;

    // ️️️✅ Best Practice: Ensure that this component is isolated by preventing unknown calls
    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
  });

  // Endure clean slate after each test
  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    await stopWebServer();
    nock.enableNetConnect();
  });

  describe('Fetching the overview', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/overview');
      expect(response.status).toBe(401);
    });

    it('responds with 200 when successful', async function () {
      // ️️️✅ Best Practice: Intercept requests for 3rd party services to eliminate undesired side effects like emails or SMS
      // ️️️✅ Best Practice: Specify the body when you need to make sure you call the 3rd party service as expected
      let googlePayload;
      nock('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate')
        .post('/', (payload) => ((googlePayload = payload), true))
        .reply(200);

      const startTimeQuery = faker.date.recent(30).toISOString();
      const endTimeQuery = faker.date.recent(30).toISOString();
      const date = faker.date.recent(30).toISOString();

      const response = await axiosAPIClient.get(
        `/overview?startTime=${startTimeQuery}&endTime=${endTimeQuery}&date=${date}`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toBe(200);
      //   expect(googlePayload).toMatchObject({
      //     aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
      //     bucketByTime: { durationMillis: 86400000 },
      //     startTimeMillis: startTimeQuery, // day start time in UNIX
      //     endTimeMillis: endTimeQuery, // day end time in UNIX
      //   });
    });
  });
});
