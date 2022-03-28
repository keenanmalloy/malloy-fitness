import { request } from "test/server";

describe("GET /muscle-groups", function () {
  it("responds with 200 successfully fetched list of muscle-groups", async function () {
    const res = await request
      .get("/muscle-groups")
      .set("Accept", "application/json");

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Muscle groups fetched successfully");
  });
});

describe("GET /muscle-groups/:pk", function () {
  it("responds with 200 successfully fetched workout", async function () {
    const res = await request
      .get(`/muscle-groups/1000`)
      .set("Accept", "application/json");

    expect(res.status).toEqual(200);
  });
});
