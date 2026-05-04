import fs from "node:fs";
import path from "node:path";

export function getLocalDayParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { year: values.year, month: values.month, day: values.day };
}

export function getSessionDayDirectory(codexHome, date, timeZone) {
  const { year, month, day } = getLocalDayParts(date, timeZone);
  return path.join(codexHome, "sessions", year, month, day);
}

export function listSessionFiles(dayDirectory) {
  if (!fs.existsSync(dayDirectory)) return [];

  return fs.readdirSync(dayDirectory)
    .filter((name) => name.endsWith(".jsonl"))
    .map((name) => path.join(dayDirectory, name));
}

export function countUserMessages(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  return lines.reduce((count, line) => count + userMessageWeight(line), 0);
}

function userMessageWeight(line) {
  if (!line.trim()) return 0;

  try {
    const record = JSON.parse(line);
    const payload = JSON.stringify(record.payload ?? {});
    return payload.includes('"role":"user"') || payload.includes('"type":"input_text"') ? 1 : 0;
  } catch {
    return 0;
  }
}

