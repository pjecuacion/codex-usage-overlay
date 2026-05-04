// Purpose: Verify Codex local session file parsing.
// Expected behavior: User-like input records are counted without crashing on malformed lines.
// Related bug or lesson ID: Feature plan 2026-05-04 Codex usage overlay.
// Preconditions: Temporary local files only; no real Codex data required.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { countUserMessages, getLocalDayParts } from "../../src/usage/sessionFiles.js";

test("counts input_text records in a session jsonl file", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codex-usage-"));
  const file = path.join(dir, "session.jsonl");

  fs.writeFileSync(file, [
    JSON.stringify({ payload: { items: [{ type: "input_text", text: "hi" }] } }),
    JSON.stringify({ payload: { role: "assistant", text: "hello" } }),
    "not json"
  ].join("\n"));

  assert.equal(countUserMessages(file), 1);
});

test("returns stable local day parts for a timezone", () => {
  const parts = getLocalDayParts(new Date("2026-05-03T23:30:00.000Z"), "Australia/Sydney");

  assert.deepEqual(parts, { year: "2026", month: "05", day: "04" });
});

