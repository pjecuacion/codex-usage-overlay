# Technical Changelog

## [0.5.0] - 2026-05-05
- Files changed: `README`, `LICENSE`, `.gitignore`, `.github/workflows/release.yml`, `docs/CONTRIBUTING.md`, `docs/SECURITY.md`, `package.json`, `package-lock.json`, `picframes/__init__.py`.
- Added GitHub release workflow triggered by `v*.*.*` tags.
- Added `release:check` script for local pre-release verification.
- Configured installer artifacts to stay out of git history via `.gitignore`.

## [0.4.0] - 2026-05-04
- Files changed: `package.json`, `package-lock.json`, `picframes/__init__.py`, `docs/*`.
- Added Electron Builder NSIS packaging via `npm run dist:win`.
- Configured x64 Windows installer output under `dist/` with Start Menu and desktop shortcuts.
- Disabled executable edit/sign helper extraction for the app binary to avoid local symlink privilege failures during unsigned builds.

## [0.3.0] - 2026-05-04
- Files changed: `package.json`, `package-lock.json`, `picframes/__init__.py`, `src/usage/pacing.js`, `src/usage/codexApiUsage.js`, `src/main/main.js`, `src/renderer/*`, `scripts/smoke-electron.js`, `tests/unit/pacing.test.js`, `tests/unit/codexApiUsage.test.js`, `tests/bugs/BUG-001-preload-api.test.js`, `docs/*`.
- Added deterministic pacing calculations based on used percent, reset timestamp, and window duration.
- Updated renderer smoke coverage to verify pacing guidance is visible.

## [0.2.0] - 2026-05-04
- Files changed: `package.json`, `package-lock.json`, `picframes/__init__.py`, `src/usage/codexApiUsage.js`, `src/usage/index.js`, `src/main/main.js`, `src/renderer/*`, `scripts/smoke-electron.js`, `tests/unit/codexApiUsage.test.js`, `docs/*`.
- Added exact usage provider for `https://chatgpt.com/backend-api/wham/usage` using Codex Desktop auth from `~/.codex/auth.json`.
- Updated snapshot shape to include rate-limit windows for renderer display.
- Added fallback behavior to local session estimates when exact usage fails.

## [0.1.1] - 2026-05-04
- Files changed: `package.json`, `package-lock.json`, `picframes/__init__.py`, `src/main/main.js`, `src/main/preload.cjs`, `src/renderer/renderer.js`, `scripts/smoke-electron.js`, `tests/bugs/BUG-001-preload-api.test.js`, `docs/bugs/*`, `docs/tasks/lessons.md`.
- Replaced ESM preload with CommonJS preload to match Electron preload execution.
- Added a bug regression test that launches Electron and verifies the renderer receives mocked usage data.

## [0.1.0] - 2026-05-04
- Files changed: `package.json`, `picframes/__init__.py`, `src/main/*`, `src/renderer/*`, `src/usage/*`, `tests/*`, `docs/*`.
- Implemented an Electron overlay with isolated preload IPC.
- Implemented local Codex session scanning and deterministic usage math.
- Added Node test coverage for estimate math, session parsing, and mocked integration flow.
