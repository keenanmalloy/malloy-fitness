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

describe('GET /workouts/:pk/exercises:pk', function () {
  it('responds with 401 Unauthenticated', async function () {
    const res = await request
      .get('/workouts/1000/exercises/1000')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('responds with 403 Unauthenticated', async function () {
    const res = await request
      .get('/workouts/1003/exercises/1000')
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it('responds with 200 - Confirms next/prev order on exercise workout', async function () {
    await request
      .post('/workouts/1000/exercises')
      .send({
        order: 1,
        priority: 1,
        exerciseId: 1000,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    await request
      .post('/workouts/1000/exercises')
      .send({
        order: 2,
        priority: 1,
        exerciseId: 1001,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    await request
      .post('/workouts/1000/exercises')
      .send({
        order: 3,
        priority: 1,
        exerciseId: 1002,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    const ex1 = await request
      .get('/workouts/1000/exercises/1000')
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(ex1.body.next.order).not.toBeNull();
    expect(ex1.body.prev.order).toBeNull();
    expect(ex1.status).toEqual(200);

    const ex2 = await request
      .get('/workouts/1000/exercises/1001')
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(ex2.body.next.order).not.toBeNull();
    expect(ex2.body.prev.order).not.toBeNull();
    expect(ex2.status).toEqual(200);

    const ex3 = await request
      .get('/workouts/1000/exercises/1002')
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(ex3.body.next.order).toBeNull();
    expect(ex3.body.prev).not.toBeNull();
    expect(ex3.status).toEqual(200);
  });

  it('responds with 200 - Confirms next/prev priority on exercise workout', async function () {
    await request
      .post('/workouts/1001/exercises')
      .send({
        order: 1,
        priority: 1,
        exerciseId: 1000,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    await request
      .post('/workouts/1001/exercises')
      .send({
        order: 1,
        priority: 2,
        exerciseId: 1001,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    await request
      .post('/workouts/1001/exercises')
      .send({
        order: 1,
        priority: 3,
        exerciseId: 1002,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    const ex1 = await request
      .get('/workouts/1001/exercises/1000')
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(ex1.body.next.priority).not.toBeNull();
    expect(ex1.body.prev.priority).toBeNull();
    expect(ex1.status).toEqual(200);

    const ex2 = await request
      .get('/workouts/1001/exercises/1001')
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(ex2.body.next.priority).not.toBeNull();
    expect(ex2.body.prev.priority).not.toBeNull();
    expect(ex2.status).toEqual(200);

    const ex3 = await request
      .get('/workouts/1001/exercises/1002')
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(ex3.body.next.priority).toBeNull();
    expect(ex3.body.prev.priority).not.toBeNull();
    expect(ex3.status).toEqual(200);
  });
});

describe('POST /workouts/:pk/exercises', function () {
  it('responds with 401 Unauthenticated', async function () {
    const res = await request
      .post('/workouts/1000/exercises')
      .send({
        order: 1,
        priority: 1,
        exerciseId: 1000,
      })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('responds with 422 unprocessable entity', async function () {
    const res = await request
      .post('/workouts/1000/exercises')
      .send({
        order: 1,
        priority: 1,
        exerciseId: 'invalid exercise id',
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it('responds with 201 success', async function () {
    const res = await request
      .post('/workouts/1000/exercises')
      .send({
        order: 1,
        priority: 1,
        exerciseId: 1006,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    deletable = res.body.exercise.exercise_id;

    expect(res.status).toEqual(201);
  });
});

describe('PATCH /workouts/:pk/exercises/:pk - update workout-exercise metadata', function () {
  it('responds with 401 Unauthenticated', async function () {
    const res = await request
      .patch(`/workouts/1000/exercises/${deletable}`)
      .send({
        order: 2,
        priority: 2,
      })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('responds with 403 Unauthorized', async function () {
    const res = await request
      .patch(`/workouts/1003/exercises/${deletable}`)
      .send({
        order: 2,
        priority: 2,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it('responds with 422 unprocessable entity', async function () {
    const res = await request
      .patch(`/workouts/1000/exercises/${deletable}`)
      .send({
        order: 2,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it('responds with 200 success', async function () {
    const res = await request
      .patch(`/workouts/1000/exercises/${deletable}`)
      .send({
        notes: 'update notes',
        sets: '2',
        repetitions: '10-12',
        reps_in_reserve: '1',
        rest_period: '120 seconds',
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});

describe('PUT /workouts/:pk/exercises/:pk', function () {
  it('responds with 401 Unauthenticated', async function () {
    const res = await request
      .put(`/workouts/1000/exercises/${deletable}`)
      .send({
        order: 2,
        priority: 2,
      })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('responds with 403 Unauthorized', async function () {
    const res = await request
      .put(`/workouts/1003/exercises/${deletable}`)
      .send({
        order: 2,
        priority: 2,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it('responds with 422 unprocessable entity', async function () {
    const res = await request
      .put(`/workouts/1000/exercises/${deletable}`)
      .send({})
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it('responds with 200 successfully updated', async function () {
    const res = await request
      .put(`/workouts/1000/exercises/${deletable}`)
      .send({
        order: 2,
        priority: 2,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(200);
  });

  it('responds with 404 not found', async function () {
    const res = await request
      .put(`/workouts/1000/exercises/99999`)
      .send({
        order: 2,
        priority: 2,
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(404);
  });
});

describe('DELETE /workouts/:pk/exercises/:pk', function () {
  it('responds with 401 Unauthenticated', async function () {
    const res = await request
      .delete('/workouts/1000/exercises/1000')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('responds with 403 Unauthorized', async function () {
    const res = await request
      .delete('/workouts/1003/exercises/1000')
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it('responds with 200 successfully deleted', async function () {
    const res = await request
      .delete(`/workouts/1000/exercises/${deletable}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(200);
  });

  it('responds with 404 not found', async function () {
    const res = await request
      .delete(`/workouts/1000/exercises/${deletable}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toEqual(404);
  });
});
