import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { parseTaskReference, repositorySlug, summarizeSubmission } from "../src/index.js";

const cliPath = fileURLToPath(new URL("../src/cli.js", import.meta.url));

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

test("CLI parse-ref prints parsed JSON", () => {
  const result = runCli(["parse-ref", "russellromney/voluntoken-dogfood #12"]);

  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    owner: "russellromney",
    repo: "voluntoken-dogfood",
    number: 12
  });
  assert.equal(result.stderr, "");
});

test("CLI parse-ref exits non-zero for malformed references", () => {
  const result = runCli(["parse-ref", "not-a-reference"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Malformed task reference/);
});

test("CLI summarize prints submission summary", () => {
  const result = runCli([
    "summarize",
    "--summary",
    "Added CLI.",
    "--commit",
    "abc123",
    "--tests",
    "npm test",
    "--risks",
    "Low risk."
  ]);

  assert.equal(result.status, 0);
  assert.equal(
    result.stdout.trim(),
    [
      "Summary: Added CLI.",
      "Commit: abc123",
      "Tests: npm test",
      "Risks: Low risk."
    ].join("\n")
  );
  assert.equal(result.stderr, "");
});

test("CLI summarize exits non-zero when required args are missing", () => {
  const result = runCli(["summarize", "--summary", "Added CLI.", "--commit", "abc123"]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /test output is required/);
});

test("CLI examples prints task references and summarize command", () => {
  const result = runCli(["examples"]);
  const lines = result.stdout.trim().split("\n");

  assert.equal(result.status, 0);
  assert.deepEqual(lines, [
    "russellromney/voluntoken-dogfood #5",
    "openai/codex #42",
    "voluntoken/voluntoken #108",
    'voluntoken-dogfood summarize --summary "Added CLI examples." --commit abc123 --tests "npm test" --risks "Low risk."'
  ]);
  assert.equal(result.stderr, "");
});

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8"
  });
}
