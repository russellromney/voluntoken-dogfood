import assert from "node:assert/strict";
import test from "node:test";
import { parseTaskReference, repositorySlug, summarizeSubmission } from "../src/index.js";

test("parses owner/repo task references", () => {
  assert.deepEqual(parseTaskReference("russellromney/voluntoken-dogfood#12"), {
    owner: "russellromney",
    repo: "voluntoken-dogfood",
    number: 12
  });
});

test("parses owner/repo task references with whitespace around the marker", () => {
  const expected = {
    owner: "russellromney",
    repo: "voluntoken-dogfood",
    number: 12
  };

  assert.deepEqual(parseTaskReference("russellromney/voluntoken-dogfood #12"), expected);
  assert.deepEqual(parseTaskReference("russellromney/voluntoken-dogfood   #   12"), expected);
});

test("returns null for invalid task references", () => {
  assert.equal(parseTaskReference("voluntoken-dogfood#12"), null);
  assert.equal(parseTaskReference("russellromney/voluntoken-dogfood"), null);
});

test("builds repository slugs", () => {
  assert.equal(repositorySlug("russellromney", "voluntoken-dogfood"), "russellromney__voluntoken-dogfood");
});

test("rejects invalid slug parts", () => {
  assert.throws(() => repositorySlug("russell romney", "voluntoken-dogfood"), /GitHub-style/);
});

test("formats submission summaries", () => {
  assert.equal(
    summarizeSubmission({
      summary: "Added parser coverage.",
      commitSha: "abc123",
      tests: "npm test",
      risks: "Low risk."
    }),
    [
      "Summary: Added parser coverage.",
      "Commit: abc123",
      "Tests: npm test",
      "Risks: Low risk."
    ].join("\n")
  );
});
