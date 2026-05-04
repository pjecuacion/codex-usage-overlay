# Lessons

## LESSON-001 - Windows drive switching in run commands

### What went wrong
The run instructions used `cd E:\Git\codex_usage` without explaining that Command Prompt does not switch from `C:` to `E:` unless `/d` is used.

### Why it happened
The command was written from a PowerShell-oriented habit, but the user ran it in Command Prompt.

### New rule
When giving Windows commands that enter a directory on another drive, provide either PowerShell `Set-Location E:\path` or Command Prompt `cd /d E:\path`.

### Correct behavior
Use:

```bat
cd /d E:\Git\codex_usage
npm start
```

## LESSON-002 - Electron launch is not enough

### What went wrong
The overlay launch smoke test only checked that an Electron process appeared. It did not check whether the renderer could access the preload API.

### Why it happened
The verification stopped at process startup instead of testing the user-visible widget behavior.

### New rule
For Electron UI fixes, run a renderer-level smoke test that checks preload APIs and visible DOM output.

### Correct behavior
Use:

```powershell
npm run smoke:electron
npm test
```

## LESSON-003 - Inspect the visible product before settling for estimates

### What went wrong
The first version used local session estimates even though Codex Desktop already showed exact rate-limit percentages in its account menu.

### Why it happened
The implementation stopped after finding local session files and did not inspect the installed app bundle for the menu's real data source.

### New rule
When a user points to an existing UI that shows the desired data, inspect that UI's local code or network path before building an estimate.

### Correct behavior
Find the source behind the visible UI, verify it safely, then use it as the primary source with estimates only as fallback.
