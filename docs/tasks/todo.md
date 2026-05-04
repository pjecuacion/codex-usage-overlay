# Current Plan

## Goal
Build a small desktop app/widget that shows remaining daily Codex usage with as much transparency as the available data allows.

## Scope
- Create a minimal app in this repository.
- Show a compact always-visible widget-style UI for daily usage.
- Make the data source explicit so the user can trust what is being shown.
- Include tests for the usage calculation logic.

## Assumptions
- Codex may not expose an official local usage API.
- If no official API or reliable local source exists, the first version should clearly show that limitation instead of pretending to know exact remaining usage.
- The widget should run locally on Windows.

## Non-Goals
- No account login or credential scraping.
- No hidden network calls.
- No unsupported scraping of private Codex app internals unless explicitly approved after review.

## Proposed Approach
- [x] Confirm the intended data source:
  - Local Codex session files are available under `~/.codex/sessions`.
  - No official Codex quota API was available in the current app context.
  - The app labels the result as an estimate.
- [x] Scaffold a small modular desktop/widget app.
- [x] Implement a usage data layer with clear source status: exact, estimated, manual, or unavailable.
- [x] Implement the widget UI with remaining daily usage, reset time, source label, and refresh state.
- [x] Add deterministic tests under `tests/` for usage math and data-source fallback behavior.
- [x] Document setup and limitations under `docs/`.
- [x] Run verification and add a review section here.

## Test Strategy
- Unit tests in `tests/unit/` for quota math, percentage remaining, reset-window handling, and source status mapping.
- Integration tests in `tests/integration/` for app data flow using mocked usage providers.
- No tests should call external networks or depend on the real current time without mocking.

## Open Questions
- Should the widget be a native desktop overlay, a small browser app, or a tray-style app?
- Do you have an official Codex/OpenAI usage endpoint or export available, or should I investigate local Codex app logs first?
- What does “remaining daily usage” mean for your account: percent remaining, requests remaining, tokens remaining, or plan-limit messages?

## Review
- Built an Electron-based Windows overlay with transparent local estimates.
- Default budget is 30 sessions and 120 user-message-like entries per local day.
- Created `~/.codex-usage-overlay.json` during verification so the budget can be edited.
- Fixed BUG-001 after renderer verification showed the preload API was not exposed.
- Upgraded the primary data source to exact Codex rate-limit data from `/wham/usage`.
- Added pacing guidance for maximizing daily use while protecting the weekly limit.
- Added Windows installer packaging through Electron Builder NSIS.
- Installer output: `dist/Codex Usage Overlay Setup 0.4.0.exe`.
- Packaged app launch check passed from `dist/win-unpacked/Codex Usage Overlay.exe`.
- Installer signature check: not signed, expected for this local build.
- Added GitHub-ready open-source files and release workflow for tagged installer releases.
- Verification passed:
  - `npm test`: 7 passing tests, including BUG-001 regression coverage.
  - `npm audit --json`: 0 vulnerabilities after upgrading Electron.
  - `npm run smoke:electron`: renderer received mocked usage data and displayed `75%`.
- Current local snapshot during verification:
  - Exact 5-hour remaining: 96 percent.
  - Exact weekly remaining: 95 percent.
  - Pacing recommendation: use more, 26 percent under pace.
  - Source: `https://chatgpt.com/backend-api/wham/usage`.

## Remaining Tradeoff
This is exact rate-limit data from Codex Desktop's backend source, not a billing ledger.
