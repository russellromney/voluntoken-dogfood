#!/usr/bin/env node
import { parseTaskReference, summarizeSubmission } from "./index.js";

const usage = `Usage:
  voluntoken-dogfood parse-ref <reference>
  voluntoken-dogfood summarize --summary <text> --commit <sha> --tests <output> [--risks <text>]`;

function main(args) {
  const [command, ...rest] = args;

  if (command === "parse-ref") {
    return parseRef(rest);
  }

  if (command === "summarize") {
    return summarize(rest);
  }

  return fail(`Unknown command: ${command ?? "(none)"}\n${usage}`);
}

function parseRef(args) {
  if (args.length !== 1) {
    return fail(`parse-ref requires exactly one reference.\n${usage}`);
  }

  const parsed = parseTaskReference(args[0]);
  if (!parsed) {
    return fail(`Malformed task reference: ${args[0]}`);
  }

  console.log(JSON.stringify(parsed, null, 2));
  return 0;
}

function summarize(args) {
  const flags = parseFlags(args);
  if (flags.error) {
    return fail(`${flags.error}\n${usage}`);
  }

  try {
    console.log(
      summarizeSubmission({
        summary: flags.values.summary,
        commitSha: flags.values.commit,
        tests: flags.values.tests,
        risks: flags.values.risks
      })
    );
  } catch (error) {
    return fail(error.message);
  }

  return 0;
}

function parseFlags(args) {
  const values = {};

  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];

    if (!["--summary", "--commit", "--tests", "--risks"].includes(flag)) {
      return { error: `Unknown option: ${flag ?? "(none)"}`, values };
    }

    if (value === undefined || value.startsWith("--")) {
      return { error: `${flag} requires a value`, values };
    }

    values[flag.slice(2)] = value;
  }

  return { values };
}

function fail(message) {
  console.error(message);
  return 1;
}

process.exitCode = main(process.argv.slice(2));
