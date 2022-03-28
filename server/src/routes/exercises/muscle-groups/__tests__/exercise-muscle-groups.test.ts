import { MAX_AGE } from "cookies";
import { generateAuthToken } from "sessions";
import { request } from "test/server";

let token: string | null = null;
let deletable: string | null = null;
let deletable2: string | null = null;

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

describe("POST /exercises/:pk/muscle-group", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .post("/exercises/1000/muscle-group/")
      .send({
        group: "primary",
        muscleGroupId: 1000,
      })
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 422 unprocessable entity", async function () {
    const res = await request
      .post("/exercises/1000/muscle-group")
      .send({
        group: "invalid-group",
        muscleGroupId: 1000,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it("responds with 201 success with primary group", async function () {
    const res = await request
      .post("/exercises/1000/muscle-group")
      .send({
        group: "primary",
        muscleGroupId: 1000,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    deletable = res.body.muscleGroup.muscle_group_id;
    expect(res.status).toEqual(201);
  });

  it("responds with 201 success with secondary group", async function () {
    const res = await request
      .post("/exercises/1000/muscle-group")
      .send({
        group: "secondary",
        muscleGroupId: 1000,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    deletable2 = res.body.muscleGroup.muscle_group_id;
    expect(res.status).toEqual(201);
  });
});

describe("DELETE /exercises/:pk/muscle-group/:pk/primary", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .delete("/exercises/1000/muscle-group/1000/primary")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .delete("/exercises/1003/muscle-group/1003/primary")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 successfully deleted", async function () {
    const res = await request
      .delete(`/exercises/1000/muscle-group/${deletable}/primary`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });

  it("responds with 404 not found", async function () {
    const res = await request
      .delete(`/exercises/1000/muscle-group/${deletable}/primary`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(404);
  });
});

describe("DELETE /exercises/:pk/muscle-group/:pk/secondary", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .delete("/exercises/1000/muscle-group/1000/secondary")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .delete("/exercises/1003/muscle-group/1003/secondary")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 successfully deleted", async function () {
    const res = await request
      .delete(`/exercises/1000/muscle-group/${deletable2}/secondary`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });

  it("responds with 404 not found", async function () {
    const res = await request
      .delete(`/exercises/1000/muscle-group/${deletable2}/secondary`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(404);
  });
});
