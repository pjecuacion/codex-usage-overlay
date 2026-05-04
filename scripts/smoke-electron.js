import { app, BrowserWindow, ipcMain } from "electron";
import os from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const preload = path.join(root, "src/main/preload.cjs");
const page = path.join(root, "src/renderer/index.html");

app.setPath("userData", path.join(os.tmpdir(), `codex-usage-overlay-smoke-${process.pid}`));

ipcMain.handle("usage:snapshot", () => ({
  kind: "exact",
  confidence: "test",
  source: "smoke-test",
  remainingPercent: 75,
  windows: [
    { label: "5h", remainingPercent: 75, resetLabel: "1:04 PM" },
    { label: "Weekly", remainingPercent: 95, resetLabel: "May 9" }
  ],
  pacing: {
    action: "use_more",
    headline: "Use more: 20% under pace",
    detail: "120m left in 5h window. Target used now: 45%."
  }
}));

app.whenReady().then(async () => {
  const errors = [];
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.webContents.on("console-message", (_event, _level, message) => {
    if (/error|cannot|undefined/i.test(message)) errors.push(message);
  });

  window.webContents.on("render-process-gone", (_event, details) => {
    errors.push(`Renderer exited: ${details.reason}`);
  });

  await window.loadFile(page);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const result = await window.webContents.executeJavaScript(`({
    hasApi: Boolean(window.codexUsage && window.codexUsage.getSnapshot),
    remaining: document.querySelector("#remaining").textContent,
    primary: document.querySelector("#primaryValue").textContent,
    guidance: document.querySelector("#guidanceHeadline").textContent,
    status: document.querySelector("#status").textContent,
    source: document.querySelector("#source").textContent
  })`);

  window.close();
  app.quit();

  if (!result.hasApi || result.remaining !== "75%" || result.primary !== "75%" || !result.guidance.includes("Use more") || errors.length > 0) {
    console.error(JSON.stringify({ result, errors }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
});
