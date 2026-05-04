import { ensureConfig } from "./config.js";
import { readCodexApiUsage } from "./codexApiUsage.js";
import { calculateUsage, getNextReset } from "./estimate.js";
import { countUserMessages, getSessionDayDirectory, listSessionFiles } from "./sessionFiles.js";

export async function readUsageSnapshot(now = new Date()) {
  try {
    return await readCodexApiUsage(now);
  } catch (error) {
    return readEstimatedUsage(now, error);
  }
}

function readEstimatedUsage(now, exactError) {
  const config = ensureConfig();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dayDirectory = getSessionDayDirectory(config.codexHome, now, timeZone);
  const files = listSessionFiles(dayDirectory);
  const messagesUsed = files.reduce((total, file) => total + countUserMessages(file), 0);

  return {
    kind: "estimated",
    confidence: files.length > 0 ? "medium" : "low",
    source: dayDirectory,
    reset: getNextReset(now, timeZone),
    checkedAt: now.toISOString(),
    configPath: config.configPath,
    exactError: exactError.message,
    ...calculateUsage({
      sessionsUsed: files.length,
      messagesUsed,
      sessionBudget: config.dailySessionBudget,
      messageBudget: config.dailyMessageBudget
    }),
    windows: [
      {
        label: "Sessions",
        remainingPercent: Math.max(0, Math.round(100 - (files.length / config.dailySessionBudget) * 100)),
        resetLabel: "local midnight"
      },
      {
        label: "Messages",
        remainingPercent: Math.max(0, Math.round(100 - (messagesUsed / config.dailyMessageBudget) * 100)),
        resetLabel: "local midnight"
      }
    ]
  };
}
