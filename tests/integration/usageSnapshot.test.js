// Purpose: Verify the usage snapshot flow can read mocked Codex session files.
// Expected behavior: Snapshot includes estimate status and budget counts.
// Related bug or lesson ID: Feature plan 2026-05-04 Codex usage overlay.
// Preconditions: Uses a mocked home directory through direct provider functions only.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { calculateUsage } from "../../src/usage/estimate.js";
import { countUserMessages, listSessionFiles } from "../../src/usage/sessionFiles.js";

test("combines mocked sessions with budget math", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codex-sessions-"));
  fs.writeFileSync(path.join(dir, "one.jsonl"), JSON.stringify({
    payload: { items: [{ type: "input_text", text: "hello" }] }
  }));

  const files = listSessionFiles(dir);
  const messages = files.reduce((total, file) => total + countUserMessages(file), 0);
  const result = calculateUsage({
    sessionsUsed: files.length,
    messagesUsed: messages,
    sessionBudget: 10,
    messageBudget: 10
  });

  assert.equal(files.length, 1);
  assert.equal(result.remainingPercent, 90);
});

