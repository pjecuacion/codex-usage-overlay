import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildPacing } from "./pacing.js";

const USAGE_URL = "https://chatgpt.com/backend-api/wham/usage";

export async function readCodexApiUsage(now = new Date()) {
  const auth = readAuth();
  const response = await fetch(USAGE_URL, { headers: buildHeaders(auth) });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Codex usage API returned ${response.status}`);
  }

  return normalizeUsage(JSON.parse(body), now);
}

export function normalizeUsage(data, now = new Date()) {
  const primary = normalizeWindow("5h", data.rate_limit?.primary_window, now);
  const secondary = normalizeWindow("Weekly", data.rate_limit?.secondary_window, now);
  const windows = [primary, secondary].filter(Boolean);
  const highestUsed = windows.reduce((max, item) => Math.max(max, item.usedPercent), 0);

  return {
    kind: "exact",
    confidence: "high",
    source: USAGE_URL,
    planType: data.plan_type ?? "unknown",
    checkedAt: now.toISOString(),
    usedPercent: Math.round(highestUsed),
    remainingPercent: Math.max(0, Math.round(100 - highestUsed)),
    windows,
    pacing: buildPacing(windows, now)
  };
}

function readAuth() {
  const authPath = path.join(os.homedir(), ".codex", "auth.json");
  const auth = JSON.parse(fs.readFileSync(authPath, "utf8"));
  const token = auth.tokens?.access_token;
  const accountId = auth.tokens?.account_id;

  if (!token || !accountId) {
    throw new Error("Codex auth token or account id is missing.");
  }

  return { token, accountId };
}

function buildHeaders(auth) {
  return {
    Authorization: `Bearer ${auth.token}`,
    "ChatGPT-Account-Id": auth.accountId,
    originator: "Codex Desktop",
    "User-Agent": "Codex Usage Overlay"
  };
}

function normalizeWindow(label, window, now) {
  if (!window) return null;

  const usedPercent = Number(window.used_percent ?? 0);
  return {
    label,
    usedPercent,
    remainingPercent: Math.max(0, Math.round(100 - usedPercent)),
    resetAt: window.reset_at ?? null,
    resetLabel: formatReset(window.reset_at, now),
    windowSeconds: window.limit_window_seconds ?? null
  };
}

function formatReset(resetAt, now) {
  if (!Number.isFinite(resetAt)) return "unknown";

  const resetDate = new Date(resetAt * 1000);
  const sameDay = resetDate.toDateString() === now.toDateString();

  if (sameDay) {
    return new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(resetDate);
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(resetDate);
}
