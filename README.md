# Codex Usage Overlay

A small Windows desktop overlay for keeping an eye on Codex usage.

The goal is simple: more transparency. The app shows local best-effort usage status so you can avoid surprises, while also seeing when you are under-using something you already pay for.

## What It Shows

- 5-hour rate limit remaining
- weekly rate limit remaining
- reset timing when available
- simple pacing guidance like `Use more`, `On track`, or `Slow down`

## Download

Install the latest Windows build from the GitHub Releases page:

[Download Codex Usage Overlay](https://github.com/pjecuacion/codex-usage-overlay/releases/latest)

The installer is currently unsigned, so Windows may show a SmartScreen warning.

## Important Limitations

This is not an official OpenAI app.

It reads local Codex Desktop auth data from `~/.codex/auth.json` and calls the same kind of usage information shown in the Codex Desktop account menu. That means the numbers should be treated as transparent best estimates, not billing-grade accounting.

The app does not display or log your auth token.

## Development

Install dependencies:

```powershell
npm install
```

Run locally:

```powershell
npm start
```

Run tests:

```powershell
npm test
```

Build a Windows installer:

```powershell
npm run dist:win
```

Run the full release check:

```powershell
npm run release:check
```

## Releases

Installer `.exe` files are published through GitHub Releases. They should not be committed to git history.

To create a release:

```powershell
git tag v0.5.1
git push origin v0.5.1
```

The GitHub Actions release workflow will test the app, build the Windows installer, and attach it to the tagged release.

## Contributing

Issues and pull requests are welcome. Please see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) before making larger changes.

## License

MIT. See [LICENSE](LICENSE).
