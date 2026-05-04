// Purpose: Verify the Electron renderer can access the Codex usage preload API.
// Expected behavior: The smoke app exits successfully after rendering mocked usage data.
// Related bug or lesson ID: BUG-001.
// Preconditions: Electron dependency installed locally; no external network calls.

import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";
import electronPath from "electron";

test("BUG-001 exposes codexUsage API to the renderer", () => {
  const result = spawnSync(electronPath, ["scripts/smoke-electron.js"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /"hasApi": true/);
  assert.match(result.stdout, /"remaining": "75%"/);
  assert.match(result.stdout, /"primary": "75%"/);
  assert.match(result.stdout, /"guidance": "Use more: 20% under pace"/);
});
