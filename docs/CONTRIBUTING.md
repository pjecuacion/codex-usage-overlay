# Contributing

## Development
Run tests before opening a pull request:

```powershell
npm test
npm run smoke:electron
```

## Installer Builds
Build the Windows installer with:

```powershell
npm run dist:win
```

Do not commit files from `dist/`. Attach installer files to GitHub Releases.

## Security
Do not log or print tokens from `~/.codex/auth.json`.

