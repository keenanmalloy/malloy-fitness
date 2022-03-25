import { request } from "test/server";

describe("GET /health", function () {
  it("responds with OK", async function () {
    const res = await request
      .get("/health")
      .set("Accept", "application/json");

    expect(res.text).toBe("OK");
    expect(res.status).toEqual(200);
  });
});


describe("GET non existant-route", function () {
  it("responds with 404", async function () {
    const res = await request
      .get("/non-existant-route")
      .set("Accept", "application/json");

    expect(res.status).toEqual(404);
  });
});

