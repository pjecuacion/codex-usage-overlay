const TARGET_UTILIZATION = 92;
const DEAD_ZONE = 8;

export function buildPacing(windows, now = new Date()) {
  const primary = windows.find((item) => item.label === "5h") ?? windows[0] ?? null;
  const weekly = windows.find((item) => item.label === "Weekly") ?? null;

  if (!primary?.resetAt || !primary.windowSeconds) {
    return fallbackPacing(windows);
  }

  const primaryPace = paceWindow(primary, now);
  const weeklyPace = weekly?.resetAt && weekly.windowSeconds ? paceWindow(weekly, now) : null;
  const action = chooseAction(primaryPace, weeklyPace);

  return {
    action,
    headline: headlineFor(action, primaryPace),
    detail: detailFor(primaryPace, weeklyPace),
    primaryPace,
    weeklyPace
  };
}

export function paceWindow(window, now = new Date()) {
  const resetMs = window.resetAt * 1000;
  const durationMs = window.windowSeconds * 1000;
  const startMs = resetMs - durationMs;
  const elapsedRatio = clamp((now.getTime() - startMs) / durationMs, 0, 1);
  const targetUsed = Math.round(elapsedRatio * TARGET_UTILIZATION);
  const paceDelta = Math.round(targetUsed - window.usedPercent);

  return {
    label: window.label,
    usedPercent: window.usedPercent,
    targetUsed,
    paceDelta,
    minutesRemaining: Math.max(0, Math.round((resetMs - now.getTime()) / 60000))
  };
}

function chooseAction(primary, weekly) {
  if (weekly && weekly.usedPercent >= 98) return "save_weekly";
  if (primary.paceDelta > DEAD_ZONE) return "use_more";
  if (primary.paceDelta < -DEAD_ZONE) return "slow_down";
  return "on_track";
}

function headlineFor(action, primary) {
  if (action === "use_more") return `Use more: ${primary.paceDelta}% under pace`;
  if (action === "slow_down") return `Slow down: ${Math.abs(primary.paceDelta)}% over pace`;
  if (action === "save_weekly") return "Weekly limit is tight";
  return "On track";
}

function detailFor(primary, weekly) {
  const weeklyText = weekly ? ` Weekly used ${weekly.usedPercent}%.` : "";
  return `${primary.minutesRemaining}m left in 5h window. Target used now: ${primary.targetUsed}%.${weeklyText}`;
}

function fallbackPacing(windows) {
  const remaining = windows[0]?.remainingPercent;
  return {
    action: "unknown",
    headline: remaining == null ? "Pacing unavailable" : "Exact usage shown",
    detail: "Pacing needs reset timestamps from the exact Codex usage source.",
    primaryPace: null,
    weeklyPace: null
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

