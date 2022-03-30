import { MAX_AGE } from 'cookies';
import { generateAuthToken } from 'sessions';
import { request } from 'test/server';

let token: string | null = null;
let deletable: string | null = null;

beforeAll(async () => {
  token = await generateAuthToken({
    createdAt: new Date().toString(),
    maxAge: MAX_AGE,
    account: {
      account_id: '1',
      name: 'Tester',
      email: 'tester@malloyfit.ca',
      active: false,
      avatar_url:
        'https://lh3.googleusercontent.com/a-/AOh14GgumKfRBh0AY4W13SE5EtwiFavA-FFGwxYTZkeX9Q=s96-c',
      role: null,
      ticket: 'ticket-goes-here',
      ticket_expiry: new Date().toString(),
    },
  });
});

describe('GET /muscle-groups', function () {
  it('responds with 200 successfully fetched list of muscle-groups', async function () {
    const res = await request
      .get('/muscle-groups')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Muscle groups fetched successfully');
  });
});

describe('GET /muscle-groups/:pk', function () {
  it('responds with 200 successfully fetched workout', async function () {
    const res = await request
      .get(`/muscle-groups/1000`)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
  });
});

describe('POST /muscle-groups/', function () {
  it('responds with 401 Unauthenticated', async function () {
    const res = await request
      .post('/muscle-groups/')
      .send({
        name: 'Muscle-Group - Integration Test',
        description: 'Description - Integration Test',
        image: 'https://cdn.trckd.ca/test-image',
      })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('responds with 422 unprocessable entity', async function () {
    const res = await request
      .post('/muscle-groups/')
      .send({})
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it('responds with 201 success', async function () {
    const res = await request
      .post('/muscle-groups/')
      .send({
        name: 'Muscle-Group - Integration Test',
        description: 'Description - Integration Test',
        image: 'https://cdn.trckd.ca/test-image',
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    deletable = res.body.muscleGroup.muscle_group_id;

    expect(res.status).toEqual(201);
  });
});

describe('PUT /muscle-groups/:pk', function () {
  it('responds with 401 Unauthenticated', async function () {
    const res = await request
      .put(`/muscle-groups/${deletable}`)
      .send({
        name: 'Muscle-Group - updated - Integration Test',
        description: 'Description - updated - Integration Test',
        image: 'https://cdn.trckd.ca/test-image-updated',
      })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('responds with 422 unprocessable entity', async function () {
    const res = await request
      .put(`/muscle-groups/${deletable}`)
      .send({
        name: 2000,
        description: 'Description - Integration Test',
        image: 'https://cdn.trckd.ca/test-image',
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it('responds with 200 successfully updated', async function () {
    const res = await request
      .put(`/muscle-groups/${deletable}`)
      .send({
        name: 'Muscle-Group - updated - Integration Test',
        description: 'Description - updated - Integration Test',
        image: 'https://cdn.trckd.ca/test-image-updated',
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});

describe('DELETE /muscle-groups/:pk', function () {
  it('responds with 401 Unauthenticated', async function () {
    const res = await request
      .delete('/muscle-groups/0')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('responds with 200 - successfully deleted', async function () {
    const res = await request
      .delete(`/muscle-groups/${deletable}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});
