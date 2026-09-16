import test from "node:test";
import assert from "node:assert/strict";
import { getPagination } from "../src/utils/pagination.js";

test("pagination has safe defaults", () => {
  assert.deepEqual(getPagination({}), { page: 1, limit: 50, skip: 0 });
});

test("pagination caps client-provided limits", () => {
  assert.deepEqual(getPagination({ page: "3", limit: "500" }), {
    page: 3,
    limit: 100,
    skip: 200,
  });
});

test("pagination rejects invalid values", () => {
  assert.throws(() => getPagination({ page: "0" }), /positive integer/);
  assert.throws(() => getPagination({ limit: "nope" }), /positive integer/);
});
