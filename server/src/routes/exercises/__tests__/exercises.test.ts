import { MAX_AGE } from "cookies";
import { generateAuthToken } from "sessions";
import { request } from "test/server";

let token: string | null = null;
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

describe("GET /exercises", function () {
  it("responds with 200 successfully fetched list of exercises", async function () {
    const res = await request
      .get("/exercises")
      .set("Accept", "application/json");

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Exercises fetched successfully");
  });
});

describe("GET /exercises/:pk", function () {
  it("responds with 200 successfully fetched list of exercises", async function () {
    const res = await request
      .get("/exercises/1000")
      .set("Accept", "application/json");

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Exercise fetched successfully");
  });
});

describe("POST /exercises/", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .post("/exercises/")
      .send({
        name: "Exercise - Integration Test",
        description: "Description - Integration Test",
        category: "Category - Integration Test",
        primary: [],
        secondary: [],
        video: null,
        profile: "short",
      })
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 422 unprocessable entity", async function () {
    const res = await request
      .post("/exercises/")
      .send({
        name: "Exercise - Integration Test",
        description: "Description - Integration Test",
        category: "Category - Integration Test",
        primary: [],
        secondary: [],
        video: null,
        profile: "unprocessable",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it("responds with 201 success", async function () {
    const res = await request
      .post("/exercises/")
      .send({
        name: "Exercise - Integration Test",
        description: "Description - Integration Test",
        category: "Category - Integration Test",
        primary: [1000, 1001],
        secondary: [1002],
        video: null,
        profile: "short",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    deletable = res.body.exercise.exercise_id;

    expect(res.status).toEqual(201);
  });
});

describe("PUT /exercises/:exerciseId", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .put(`/exercises/${deletable}`)
      .send({
        name: "Edited - Integration Test",
        description: "Edited - Integration Test",
        category: "Edited - Integration Test",
        video: null,
        profile: "unprocessable",
      })
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .put(`/exercises/1003`)
      .send({
        name: "Edited - Integration Test",
        description: "Edited - Integration Test",
        category: "Edited - Integration Test",
        video: null,
        profile: "short",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 422 unprocessable entity", async function () {
    const res = await request
      .put(`/exercises/1000`)
      .send({
        name: "Edited - Integration Test",
        description: "Edited - Integration Test",
        category: "Edited - Integration Test",
        video: null,
        profile: "unprocessable",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it("responds with 200 successfully updated", async function () {
    const res = await request
      .put(`/exercises/1000`)
      .send({
        name: "Edited - Integration Test",
        description: "Edited - Integration Test",
        category: "Edited - Integration Test",
        video: null,
        profile: "long",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});

describe("DELETE /exercises/:pk", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .delete("/exercises/0")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .delete("/exercises/1003")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 - successfully deleted", async function () {
    const res = await request
      .delete(`/exercises/${deletable}`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});
