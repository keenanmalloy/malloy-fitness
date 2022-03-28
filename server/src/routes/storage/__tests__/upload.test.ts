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

describe("GET /storage/upload", function () {
  it("responds with 401 unauthorized", async function () {
    const res = await request
      .get("/storage/upload")
      .set("Accept", "application/json");

    expect(res.status).toEqual(401);
  });

  it("responds with 400 missing filename", async function () {
    const res = await request
      .get("/storage/upload")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.body.message).toEqual("Missing file name");
    expect(res.status).toEqual(400);
  });

  it("responds with 400 missing filename", async function () {
    const res = await request
      .get("/storage/upload?file=test-file")
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`]);

    expect(res.body.message).toEqual("Missing file type");
    expect(res.status).toEqual(400);
  });
});
