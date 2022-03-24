import { MAX_AGE } from "cookies";
import { generateAuthToken } from "sessions";
import request from "supertest";
import { app } from "../../../server";

let token: string | null = null;
let deletable: string | null = null;

beforeAll(async () => {
  token = await generateAuthToken({
    createdAt: new Date().toString(),
    maxAge: MAX_AGE,
    account: {
      account_id: "9",
      name: "Jackson Malloy",
      email: "jacksmalloy@gmail.com",
      active: false,
      avatar_url:
        "https://lh3.googleusercontent.com/a-/AOh14GgumKfRBh0AY4W13SE5EtwiFavA-FFGwxYTZkeX9Q=s96-c",
      role: null,
      ticket: "ticket-goes-here",
      ticket_expiry: new Date().toString(),
    },
  });
});

describe("GET /workouts", function () {
  it("responds with 401 Unauthorized", async function () {
    const res = await request(app)
      .get("/workouts")
      .set("Accept", "application/json");

    expect(res.body.message).toBe("Unauthorized");
    expect(res.status).toEqual(401);
  });

  it("responds with 200 successfully fetched list of workouts", async function () {
    const res = await request(app)
      .get("/workouts")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Workouts fetched successfully");
  });
});

describe("POST /workouts/", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request(app)
      .post("/workouts/")
      .send({
        name: "Test Workout",
        description: "Coming from an integration test",
        category: "Test",
      })
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 422 unprocessable entity", async function () {
    const res = await request(app)
      .post("/workouts/")
      .send({
        name: "Test Workout",
        description: "Coming from an integration test",
        category: "Test",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  // There is a bug here, since 2 transactions occur,
  // we first create the workout, and then mapping the exercises
  // to the workout created fail. This should fail both transactions instead.
  it("responds with 500 error - workout created, but exercises failed to map", async function () {
    const res = await request(app)
      .post("/workouts/")
      .send({
        name: "Test Workout",
        description: "Coming from an integration test",
        category: "Test",
        exercises: [{ id: "error", order: 1, priority: 1 }],
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(500);
  });

  it("responds with 201 success", async function () {
    const res = await request(app)
      .post("/workouts/")
      .send({
        name: "Test Workout",
        description: "Coming from an integration test",
        category: "Test",
        exercises: [{ id: 98, order: 1, priority: 1 }],
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    deletable = res.body.workout.workout_id;

    expect(res.status).toEqual(201);
  });
});

describe("GET /workouts/:pk", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request(app)
      .get("/workouts/unauthenticated")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request(app)
      .get(`/workouts/98`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 successfully fetched workout", async function () {
    const res = await request(app)
      .get(`/workouts/${deletable}`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});

describe("PUT /workouts/:pk", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request(app)
      .put(`/workouts/${deletable}`)
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request(app)
      .put(`/workouts/0`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 422 unprocessable entity", async function () {
    const res = await request(app)
      .put(`/workouts/${deletable}`)
      .send({
        name: "Test Workout Updated",
        description: "Coming from an integration test - Updated",
        category: 1234,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it("responds with 200 successfully updated", async function () {
    const res = await request(app)
      .put(`/workouts/${deletable}`)
      .send({
        name: "Test Workout Updated",
        description: "Coming from an integration test - Updated",
        category: "Test - Updated",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});

describe("DELETE /workouts/:pk", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request(app)
      .delete("/workouts/0")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request(app)
      .delete("/workouts/98")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 - successfully deleted", async function () {
    const res = await request(app)
      .delete(`/workouts/${deletable}`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});
