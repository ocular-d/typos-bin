## Why

JavaScript/Node.js projects have no native way to run [typos](https://github.com/crate-ci/typos) as part of their toolchain without requiring a separate Rust/system installation. A single npm package that downloads the correct pre-built typos binary at install time makes typos effortlessly available as a dev dependency in any npm, pnpm, or Yarn project.

## What Changes

- New npm package `@ocular-d/typos-bin` published to the npm registry
- Postinstall script downloads the correct typos binary for the current platform (macOS arm64/x64, Linux arm64/x64) from GitHub Releases
- CLI shim exposed as `typos` in `bin/` so users can run `npx typos` or use it in npm scripts
- JavaScript API exports the resolved binary path for programmatic use
- Default typos version pinned in `package.json`; overridable via env var or per-project config
- GitHub Actions workflow to automatically track new typos releases and publish updated `typos-bin` versions

## Capabilities

### New Capabilities

- `binary-download`: Postinstall download of the typos binary for the current platform, with version resolution and error handling
- `cli-shim`: `bin/typos` shim that forwards all arguments to the downloaded binary
- `js-api`: Exported module path to the resolved binary for programmatic use
- `release-automation`: GitHub Actions workflow to detect new typos releases and publish a matching `typos-bin` version

### Modified Capabilities

<!-- none -->

## Impact

- **New dependencies**: `@xhmikosr/bin-wrapper`, `package-config` (runtime); dev tooling for tests
- **Supported platforms**: macOS arm64, macOS x64, Linux arm64, Linux x64 (Windows not supported)
- **npm registry**: Package `typos-bin` must be published under the `svx` npm org or user scope
- **Release cadence**: typos releases ~2x/month; automation keeps typos-bin in sync without manual effort
