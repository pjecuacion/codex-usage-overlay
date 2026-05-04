// Purpose: Verify exact Codex usage API response normalization.
// Expected behavior: API usage windows become safe display values without network calls.
// Related bug or lesson ID: Feature plan 2026-05-04 exact Codex usage source.
// Preconditions: Deterministic mocked API response only.

import test from "node:test";
import assert from "node:assert/strict";
import { normalizeUsage } from "../../src/usage/codexApiUsage.js";

test("normalizes primary and weekly Codex usage windows", () => {
  const snapshot = normalizeUsage({
    plan_type: "prolite",
    rate_limit: {
      primary_window: {
        used_percent: 2,
        limit_window_seconds: 18000,
        reset_at: 1777863863
      },
      secondary_window: {
        used_percent: 5,
        limit_window_seconds: 604800,
        reset_at: 1778296474
      }
    }
  }, new Date("2026-05-04T00:00:00.000Z"));

  assert.equal(snapshot.kind, "exact");
  assert.equal(snapshot.remainingPercent, 95);
  assert.equal(snapshot.windows[0].label, "5h");
  assert.equal(snapshot.windows[0].remainingPercent, 98);
  assert.equal(snapshot.windows[1].label, "Weekly");
  assert.equal(snapshot.windows[1].remainingPercent, 95);
  assert.equal(snapshot.pacing.action, "use_more");
});
