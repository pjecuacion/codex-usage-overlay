export function calculateUsage({ sessionsUsed, messagesUsed, sessionBudget, messageBudget }) {
  const sessionRatio = ratio(sessionsUsed, sessionBudget);
  const messageRatio = ratio(messagesUsed, messageBudget);
  const usedRatio = Math.max(sessionRatio, messageRatio);

  return {
    sessionsUsed,
    messagesUsed,
    sessionBudget,
    messageBudget,
    usedPercent: Math.round(usedRatio * 100),
    remainingPercent: Math.max(0, Math.round((1 - usedRatio) * 100)),
    sessionsRemaining: Math.max(0, sessionBudget - sessionsUsed),
    messagesRemaining: Math.max(0, messageBudget - messagesUsed)
  };
}

export function getNextReset(now, timeZone) {
  const local = new Intl.DateTimeFormat("en-AU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(now);

  return local === "00:00" ? "now" : "local midnight";
}

function ratio(used, budget) {
  if (!Number.isFinite(budget) || budget <= 0) return 0;
  return Math.min(1, used / budget);
}

