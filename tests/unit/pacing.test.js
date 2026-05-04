// Purpose: Verify Codex usage pacing guidance.
// Expected behavior: Pacing recommends using more, slowing down, or staying on track.
// Related bug or lesson ID: Feature plan 2026-05-04 usage maximization.
// Preconditions: Deterministic mocked usage windows only.

import test from "node:test";
import assert from "node:assert/strict";
import { buildPacing } from "../../src/usage/pacing.js";

test("recommends using more when below 5h pace", () => {
  const now = new Date("2026-05-04T02:30:00.000Z");
  const pacing = buildPacing([{
    label: "5h",
    usedPercent: 10,
    resetAt: Date.parse("2026-05-04T05:00:00.000Z") / 1000,
    windowSeconds: 18000
  }], now);

  assert.equal(pacing.action, "use_more");
  assert.match(pacing.headline, /Use more/);
});

test("recommends slowing down when over 5h pace", () => {
  const now = new Date("2026-05-04T01:00:00.000Z");
  const pacing = buildPacing([{
    label: "5h",
    usedPercent: 80,
    resetAt: Date.parse("2026-05-04T05:00:00.000Z") / 1000,
    windowSeconds: 18000
  }], now);

  assert.equal(pacing.action, "slow_down");
});

test("protects the weekly limit when nearly used", () => {
  const now = new Date("2026-05-04T02:30:00.000Z");
  const pacing = buildPacing([
    {
      label: "5h",
      usedPercent: 10,
      resetAt: Date.parse("2026-05-04T05:00:00.000Z") / 1000,
      windowSeconds: 18000
    },
    {
      label: "Weekly",
      usedPercent: 99,
      resetAt: Date.parse("2026-05-11T00:00:00.000Z") / 1000,
      windowSeconds: 604800
    }
  ], now);

  assert.equal(pacing.action, "save_weekly");
});

