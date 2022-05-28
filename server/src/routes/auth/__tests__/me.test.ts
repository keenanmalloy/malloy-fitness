import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';

describe('Me API', function () {
  let axiosAPIClient: AxiosInstance;
  let cookie: string;
  let accountId: string;

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
  });

  afterAll(async () => {
    await stopWebServer();
  });

  describe('Fetching settings about goals', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/auth/me/');
      expect(response.status).toBe(401);
    });

    it('responds with 200 when successfully retrieves account', async function () {
      const response = await axiosAPIClient.get(`/auth/me/`, {
        headers: {
          Cookie: cookie,
        },
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Updating account information', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.patch('/auth/me/');
      expect(response.status).toBe(401);
    });

    it('responds with 422 when invalid / missing body', async function () {
      const response = await axiosAPIClient.patch(
        `/auth/me/`,
        {
          city: 22222,
        },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      expect(response.status).toBe(422);
    });

    it('responds with 200 when request updates account', async function () {
      const body = {
        name: faker.name.firstName(),
        given_name: faker.name.firstName(),
        family_name: faker.name.lastName(),
        description: faker.lorem.sentence(),
        avatar_url: faker.image.imageUrl(),
        phone: faker.phone.phoneNumber(),
        gender: faker.helpers.arrayElement([
          'male',
          'female',
          'prefer not to say',
        ]),
        dob: faker.date.past().toISOString(),
        weight: +faker.random.numeric(3),
        height: +faker.random.numeric(3),
        country: faker.address.countryCode(),
        city: faker.address.city(),
      };
      await axiosAPIClient.patch(`/auth/me/`, body, {
        headers: {
          Cookie: cookie,
        },
      });

      const response = await axiosAPIClient.get(`/auth/me/`, {
        headers: {
          Cookie: cookie,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.account.name).toBe(body.name);
      expect(response.data.account.given_name).toBe(body.given_name);
      expect(response.data.account.family_name).toBe(body.family_name);
      expect(response.data.account.description).toBe(body.description);
      expect(response.data.account.avatar_url).toBe(body.avatar_url);
      expect(response.data.account.phone).toBe(body.phone);
      expect(response.data.account.gender).toBe(body.gender);
      expect(response.data.account.dob).toBe(body.dob);
      expect(response.data.account.weight).toBe(body.weight);
      expect(response.data.account.height).toBe(body.height);
      expect(response.data.account.country).toBe(body.country);
      expect(response.data.account.city).toBe(body.city);
    });
  });
});
