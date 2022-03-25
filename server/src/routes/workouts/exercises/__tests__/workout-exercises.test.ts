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

describe("POST /workouts/:pk/exercises", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .post("/workouts/1000/exercises")
      .send({
        order: 1,
        priority: 1,
        exerciseId: 1000,
      })
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 422 unprocessable entity", async function () {
    const res = await request
      .post("/workouts/1000/exercises")
      .send({
        order: 1,
        priority: 1,
        exerciseId: "invalid exercise id",
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(422);
  });

  it("responds with 201 success", async function () {
    const res = await request
      .post("/workouts/1000/exercises")
      .send({
        order: 1,
        priority: 1,
        exerciseId: 1000,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    deletable = res.body.exercise.exercise_id;

    expect(res.status).toEqual(201);
  });
});

// describe("GET /workouts/:pk", function () {
//   it("responds with 401 Unauthenticated", async function () {
//     const res = await request
//       .get("/workouts/unauthenticated")
//       .set("Accept", "application/json");

//     expect(res.status).toEqual(401);
//   });

//   it("responds with 403 Unauthorized", async function () {
//     const res = await request
//       .get(`/workouts/98`)
//       .set("Accept", "application/json")
//       .set("Cookie", [`token=${token}`]);

//     expect(res.status).toEqual(403);
//   });

//   it("responds with 200 successfully fetched workout", async function () {
//     const res = await request
//       .get(`/workouts/${deletable}`)
//       .set("Accept", "application/json")
//       .set("Cookie", [`token=${token}`]);

//     expect(res.status).toEqual(200);
//   });
// });

describe("PUT /workouts/:pk/exercises/:pk", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .put(`/workouts/1000/exercises/${deletable}`)
      .send({
        order: 2,
        priority: 2,
      })
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .put(`/workouts/1003/exercises/${deletable}`)
      .send({
        order: 2,
        priority: 2,
      })
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

//   it("responds with 500 server error as DB cannot process text in int field", async function () {
//     const res = await request
//       .put(`/workouts/1000/exercises/${deletable}`)
//       .send({
//         order: 2,
//         priority: 'WHAT',
//       })
//       .set("Accept", "application/json")
//       .set("Cookie", [`token=${token}`]);

//     expect(res.status).toEqual(500);
//   });

  //   it("responds with 200 successfully updated", async function () {
  //     const res = await request
  //       .put(`/workouts/${deletable}`)
  //       .send({
  //         name: "Test Workout Updated",
  //         description: "Coming from an integration test - Updated",
  //         category: "Test - Updated",
  //       })
  //       .set("Accept", "application/json")
  //       .set("Cookie", [`token=${token}`]);

  //     expect(res.status).toEqual(200);
  //   });
});

// describe("DELETE /workouts/:pk", function () {
//   it("responds with 401 Unauthenticated", async function () {
//     const res = await request
//       .delete("/workouts/0")
//       .set("Accept", "application/json");

//     expect(res.status).toEqual(401);
//   });

//   it("responds with 403 Unauthorized", async function () {
//     const res = await request
//       .delete("/workouts/98")
//       .set("Accept", "application/json")
//       .set("Cookie", [`token=${token}`]);

//     expect(res.status).toEqual(403);
//   });

//   it("responds with 200 - successfully deleted", async function () {
//     const res = await request
//       .delete(`/workouts/${deletable}`)
//       .set("Accept", "application/json")
//       .set("Cookie", [`token=${token}`]);

//     expect(res.status).toEqual(200);
//   });
// });
