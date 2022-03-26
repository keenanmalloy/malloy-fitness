import { MAX_AGE } from "cookies";
import { generateAuthToken } from "sessions";
import { request } from "test/server";

let token: string | null = null;
let exerciseId: string | null = null;
let deletable: string | null = null;

beforeAll(async () => {
  token = await generateAuthToken({
    createdAt: new Date().toString(),
    maxAge: MAX_AGE,
    account: {
      account_id: "1",
      name: "Tester",
      email: "tester@malloyfit.ca",
      active: false,
      avatar_url:
        "https://lh3.googleusercontent.com/a-/AOh14GgumKfRBh0AY4W13SE5EtwiFavA-FFGwxYTZkeX9Q=s96-c",
      role: null,
      ticket: "ticket-goes-here",
      ticket_expiry: new Date().toString(),
    },
  });
});

describe("GET /workouts/:pk/exercise/:pk/sets", function () {
  it("responds with 401 unauthorized", async function () {
    const res = await request
      .get("/workouts/1000/exercise/1000/sets")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 forbidden", async function () {
    const res = await request
      .get("/workouts/1004/exercise/1000/sets")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 fetched all sets by exercise", async function () {
    const res = await request
      .get("/workouts/1000/exercise/1000/sets")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});

describe("GET /workouts/:pk/sets", function () {
  it("responds with 401 unauthorized", async function () {
    const res = await request
      .get("/workouts/1000/sets")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 forbidden", async function () {
    const res = await request
      .get("/workouts/1004/sets")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 fetched all sets by workout", async function () {
    const res = await request
      .get("/workouts/1000/sets")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});

describe("POST /workouts/:pk/sets", function () {
  it("responds with 401 unauthorized", async function () {
    const res = await request
      .post("/workouts/1000/sets")
      .send({
        exercise_id: 1000,
        repetitions: 12,
        weight: 120,
      })
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 forbidden", async function () {
    const res = await request
      .post("/workouts/1004/sets")
      .send({
        exercise_id: 1000,
        repetitions: 12,
        weight: 120,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 422 unprocessable entity", async function () {
    const res = await request
      .post("/workouts/1000/sets")
      .send({
        exercise_id: 1000,
        repetitions: 12,
        weight: "cannot-process",
      })
      .set("Cookie", [`token=${token}`])
      .set("Accept", "application/json");

    expect(res.status).toEqual(422);
  });

  it("responds with 200 set recorded", async function () {
    const res = await request
      .post("/workouts/1000/sets")
      .send({
        exercise_id: 1000,
        repetitions: 12,
        weight: 120,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    exerciseId = res.body.set.exercise_id;
    deletable = res.body.set.set_id;

    expect(res.status).toEqual(200);
  });
});

describe("PUT /workouts/:pk/sets/:pk", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .put(`/workouts/1000/sets/${exerciseId}`)
      .send({
        weight: 123,
        repetitions: 15,
      })
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .put(`/workouts/1003/sets/${exerciseId}`)
      .send({
        weight: 123,
        repetitions: 15,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 422 unprocessable entity", async function () {
    const res = await request
      .put(`/workouts/1000/sets/${exerciseId}`)
      .send({
        weight: "cannot process",
        repetitions: "15",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it("responds with 200 successfully updated", async function () {
    const res = await request
      .put(`/workouts/1000/sets/${deletable}`)
      .send({
        weight: 123,
        repetitions: 15,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });

  it("responds with 404 not found", async function () {
    const res = await request
      .put(`/workouts/1000/sets/1006`)
      .send({
        weight: 123,
        repetitions: 15,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(404);
  });
});

describe("DELETE /workouts/:pk/exercise/:pk/sets", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .delete("/workouts/1000/exercise/1000/sets")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .delete("/workouts/1004/exercise/1000/sets")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 successfully deleted", async function () {
    const res = await request
      .delete(`/workouts/1000/exercise/1000/sets`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });

  it("responds with 404 not found", async function () {
    const res = await request
      .delete(`/workouts/1000/exercises/1000/sets`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(404);
  });
});

describe("DELETE /workouts/:pk/sets/:pk", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .delete("/workouts/1000/sets/1")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .delete("/workouts/1003/sets/1")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 successfully deleted", async function () {
    const deletableSet = await request
      .post("/workouts/1000/sets")
      .send({
        exercise_id: 1000,
        repetitions: 12,
        weight: 120,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    const res = await request
      .delete(`/workouts/1000/sets/${deletableSet.body.set.set_id}`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });

  it("responds with 404 not found", async function () {
    const res = await request
      .delete(`/workouts/1000/exercises/1000/1234`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(404);
  });
});
