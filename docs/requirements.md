# Requirements

## Product Goal
Give the user a Windows desktop overlay that shows Codex rate-limit usage as transparently as possible.

## Functional Requirements
- Show an always-on-top desktop overlay.
- Read exact Codex rate-limit usage from the same ChatGPT backend endpoint used by Codex Desktop when available.
- Fall back to local Codex session-file estimates when exact usage cannot be read.
- Show remaining percentage, five-hour remaining usage, weekly remaining usage, confidence, and source path.
- Show pacing guidance that helps maximize usage without accidentally exhausting the weekly limit.
- Provide a Windows installer that installs the overlay as a normal desktop app.
- Refresh automatically and support manual refresh.
- Store user-adjustable daily budgets in `~/.codex-usage-overlay.json`.

## Transparency Requirements
- The app must label exact API data as exact and fallback data as estimated.
- Pacing guidance must be deterministic and based on reset timestamps and usage percentages.
- Installer builds must use the same version as `package.json` and `picframes/__init__.py`.
- The app must not read or display secrets from Codex auth files.
- The app may call `https://chatgpt.com/backend-api/wham/usage` using the local Codex Desktop auth token.

## Non-Requirements
- No official billing reconciliation beyond the Codex rate-limit endpoint.
- No account login in v1.
- No automatic modification of Codex app internals.
