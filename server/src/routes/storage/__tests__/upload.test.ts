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

describe("POST /storage/upload", function () {
  it("responds with 401 unauthorized", async function () {
    const res = await request
      .post("/storage/upload")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  //   it("responds with 404 not found", async function () {
  //     const res = await request
  //       .post("/storage/upload")
  //       .set("Accept", "application/json")
  //       .set("Cookie", [`token=${token}`]);

  //     expect(res.status).toEqual(404);
  //   });
});
