# Security

## Sensitive Data
Codex Usage Overlay reads the local Codex Desktop auth file so it can call the Codex usage endpoint.

Rules:

- Do not log access tokens.
- Do not upload auth files.
- Do not include user-specific config in releases.

## Reporting Issues
For public release, use GitHub Issues for non-sensitive bugs. For token or auth handling concerns, avoid posting secrets in issues.

