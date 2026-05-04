# Changelog

## [0.5.1] - 2026-05-05
### Fixed
- Fixed GitHub release builds by disabling Electron Builder's implicit publish step.

## [0.5.0] - 2026-05-05
### Added
- Added open-source repository files for GitHub publishing.
- Added a GitHub Actions release workflow that builds the Windows installer and uploads it to tagged releases.
- Added contribution and security documentation.

## [0.4.0] - 2026-05-04
### Added
- Added a Windows installer build for Codex Usage Overlay.
- Added installer shortcuts for desktop and Start Menu.

## [0.3.0] - 2026-05-04
### Added
- Added pacing guidance to help maximize Codex usage each day.
- The overlay now recommends when to use more, slow down, stay on track, or protect the weekly limit.

## [0.2.0] - 2026-05-04
### Added
- Added exact Codex rate-limit usage by calling the same `/wham/usage` endpoint used by Codex Desktop.
- Updated the overlay to show five-hour and weekly remaining usage with reset labels.
- Kept the local session estimate as a fallback when exact usage is unavailable.

## [0.1.1] - 2026-05-04
### Fixed
- Fixed the desktop overlay so the renderer can read local usage through Electron preload.
- Added an Electron smoke test that checks the widget actually renders mocked usage data.

## [0.1.0] - 2026-05-04
### Added
- Added a Windows desktop overlay that estimates remaining daily Codex usage from local session files.
- Added configurable daily session and message budgets.
- Added transparent confidence/source labels so estimated data is not confused with official quota data.
