# Voluntoken Dogfood

This is a small public repository for testing Voluntoken against a real GitHub repo.

The code is intentionally simple: a no-dependency Node.js package with a few task and evidence helpers. It gives Voluntoken enough surface area to test task creation, local agent execution, review evidence, commits, and maintainer decisions without hiding product issues behind a large application.

## Commands

```bash
npm test
```

## CLI

```bash
npx voluntoken-dogfood parse-ref "russellromney/voluntoken-dogfood #12"

npx voluntoken-dogfood summarize \
  --summary "Added parser coverage." \
  --commit abc123 \
  --tests "npm test" \
  --risks "Low risk."
```

## Dogfood Task Ideas

- Add parsing support for task references with whitespace around `#`.
- Add a formatter for worker submission summaries.
- Add tests for invalid repository slugs.
- Improve README setup instructions after the first Voluntoken run.
- Add a small CLI wrapper around the helpers.

## Voluntoken Notes

Agents should use Voluntoken as the source of truth:

1. Read `.voluntoken/config`.
2. Claim a task before editing.
3. Make the smallest local change.
4. Run tests.
5. Commit locally.
6. Submit summary, commit SHA, test output, logs, review notes, and risks.
