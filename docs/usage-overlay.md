# Codex Usage Overlay

## What It Does
This app shows a small Windows desktop overlay with Codex rate-limit usage.

It first reads the same backend usage endpoint that Codex Desktop uses for the account menu: `https://chatgpt.com/backend-api/wham/usage`.

If that exact call fails, it falls back to local Codex session files from `~/.codex/sessions` and compares today's activity against budgets in `~/.codex-usage-overlay.json`.

## What It Shows
- Exact mode: five-hour and weekly remaining percentages, reset labels, and source URL.
- Pacing mode: whether to use more, slow down, stay on track, or protect the weekly limit.
- Estimate mode: local session/message usage against configured fallback budgets.
- Confidence label: `high` for exact API data, lower for local fallback estimates.

## Pacing Logic
The overlay compares current five-hour usage against how far through the five-hour window you are. It targets about 92 percent utilization, leaving a small safety buffer.

If weekly usage is almost exhausted, weekly protection wins over five-hour pacing.

## Auth
The app reads `~/.codex/auth.json` to use the existing Codex Desktop access token. It does not display or log the token.

## Run
Use the installer from `dist/` when available.

Install dependencies once:

```powershell
Set-Location E:\Git\codex_usage
npm install
```

Start the overlay:

```powershell
Set-Location E:\Git\codex_usage
npm start
```

## Build Installer
Create a Windows installer:

```powershell
Set-Location E:\Git\codex_usage
npm run dist:win
```

The installer is written to `dist/`.

Current installer path:

```text
E:\Git\codex_usage\dist\Codex Usage Overlay Setup 0.4.0.exe
```

This local build is not code-signed, so Windows may show an unknown publisher warning.

If you are using Command Prompt instead of PowerShell, use `/d` so Windows switches drives:

```bat
cd /d E:\Git\codex_usage
npm start
```

## Configure
After the first run, edit:

```text
~/.codex-usage-overlay.json
```

Example:

```json
{
  "dailySessionBudget": 30,
  "dailyMessageBudget": 120,
  "codexHome": "C:\\Users\\pjecu\\.codex"
}
```
