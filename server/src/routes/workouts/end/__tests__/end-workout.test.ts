import { MAX_AGE } from "cookies";
import { generateAuthToken } from "sessions";
import { request } from "test/server";

let token: string | null = null;

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

describe("PATCH /workouts/:pk/end", function () {
  it("responds with 401 Unauthenticated", async function () {
    const res = await request
      .patch("/workouts/1000/end")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 403 Unauthorized", async function () {
    const res = await request
      .patch("/workouts/1003/end")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(403);
  });

  it("responds with 200 success", async function () {
    const res = await request
      .patch("/workouts/1000/end")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).toEqual(200);
  });
});
