export function parseTaskReference(input) {
  if (typeof input !== "string") {
    throw new TypeError("task reference must be a string");
  }

  const match = input.trim().match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\s*#\s*(\d+)$/);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2],
    number: Number(match[3])
  };
}

export function repositorySlug(owner, repo) {
  if (!validName(owner) || !validName(repo)) {
    throw new Error("owner and repo must be GitHub-style names");
  }
  return `${owner}__${repo}`;
}

export function summarizeSubmission({ summary, commitSha, tests, risks = "" }) {
  const lines = [
    `Summary: ${requiredText(summary, "summary")}`,
    `Commit: ${requiredText(commitSha, "commit SHA")}`,
    `Tests: ${requiredText(tests, "test output")}`
  ];

  if (risks.trim()) {
    lines.push(`Risks: ${risks.trim()}`);
  }

  return lines.join("\n");
}

function validName(value) {
  return typeof value === "string" && /^[A-Za-z0-9_.-]+$/.test(value);
}

function requiredText(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required`);
  }
  return value.trim();
}
