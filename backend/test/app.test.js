import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

test("health endpoint responds with security headers", async () => {
  const response = await request(app).get("/").expect(200);
  assert.equal(response.body.success, true);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.ok(response.headers["content-security-policy"]);
});

test("unknown API routes use the standard error envelope", async () => {
  const response = await request(app).get("/api/does-not-exist").expect(404);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /not found/i);
});
