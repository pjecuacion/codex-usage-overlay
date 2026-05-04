import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULTS = {
  dailySessionBudget: 30,
  dailyMessageBudget: 120,
  codexHome: path.join(os.homedir(), ".codex")
};

export function getConfigPath() {
  return path.join(os.homedir(), ".codex-usage-overlay.json");
}

export function loadConfig(filePath = getConfigPath()) {
  if (!fs.existsSync(filePath)) {
    return { ...DEFAULTS, configPath: filePath, created: false };
  }

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return { ...DEFAULTS, ...parsed, configPath: filePath, created: true };
}

export function ensureConfig(filePath = getConfigPath()) {
  if (fs.existsSync(filePath)) return loadConfig(filePath);

  const config = { ...DEFAULTS };
  fs.writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`);
  return { ...config, configPath: filePath, created: true };
}

