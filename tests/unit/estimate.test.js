// Purpose: Verify transparent daily usage estimate math.
// Expected behavior: Remaining usage is bounded and based on the highest used budget ratio.
// Related bug or lesson ID: Feature plan 2026-05-04 Codex usage overlay.
// Preconditions: No external services; deterministic inputs only.

import test from "node:test";
import assert from "node:assert/strict";
import { calculateUsage } from "../../src/usage/estimate.js";

test("calculates remaining percent from the highest usage ratio", () => {
  const result = calculateUsage({
    sessionsUsed: 10,
    messagesUsed: 80,
    sessionBudget: 20,
    messageBudget: 100
  });

  assert.equal(result.usedPercent, 80);
  assert.equal(result.remainingPercent, 20);
  assert.equal(result.sessionsRemaining, 10);
  assert.equal(result.messagesRemaining, 20);
});

test("does not report negative remaining values", () => {
  const result = calculateUsage({
    sessionsUsed: 40,
    messagesUsed: 150,
    sessionBudget: 30,
    messageBudget: 120
  });

  assert.equal(result.remainingPercent, 0);
  assert.equal(result.sessionsRemaining, 0);
  assert.equal(result.messagesRemaining, 0);
});

