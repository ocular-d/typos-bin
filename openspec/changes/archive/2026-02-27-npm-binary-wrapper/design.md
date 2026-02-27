## Context

JavaScript projects have no standard way to consume Rust-built CLI tools. The convention established by `hugo-bin`, `jpegtran-bin`, and similar packages is to ship a thin npm wrapper that downloads the correct platform binary at postinstall time and exposes it via a `bin` entry in `package.json`. This design follows that pattern adapted for `typos`.

The typos project publishes pre-built binaries for macOS (arm64, x64) and Linux (arm64, x64) on every GitHub Release, named with a consistent `typos-v{version}-{target}.(tar.gz|zip)` convention.

## Goals / Non-Goals

**Goals:**
- Single npm package users `npm install --save-dev typos-bin`
- Downloads the correct platform binary at postinstall, stored in `vendor/`
- CLI shim `bin/typos` forwards all args to the downloaded binary
- JavaScript API exports the binary path for programmatic use
- Version overridable via env var or `typos-bin` key in consumer's `package.json`
- GitHub Actions automation publishes a new `typos-bin` version for each new typos release

**Non-Goals:**
- Windows support (no Windows binaries in scope)
- Bundling the binary inside the npm package itself
- Providing a configuration layer on top of typos (pass-through CLI only)
- Supporting typos versions older than the first published `typos-bin` version

## Decisions

### D1: Postinstall download over platform sub-packages

**Decision**: Use a single package with a postinstall download script, not the `optionalDependencies` pattern used by esbuild/biome.

**Rationale**: The optionalDependencies pattern requires publishing N platform-specific packages per release. With typos releasing ~2x/month, that multiplies maintenance. A single-package postinstall approach is simpler to automate and maintain.

**Alternative considered**: `optionalDependencies` (esbuild-style). Rejected due to publish overhead.

### D2: `@xhmikosr/bin-wrapper` + `package-config`

**Decision**: Use `@xhmikosr/bin-wrapper` (actively maintained fork of `bin-wrapper`) for download/extraction/caching, and `package-config` to read consumer-level config from their `package.json`.

**Rationale**: This is the same stack as `hugo-bin` (our inspiration), it handles tar.gz extraction, binary path resolution, and caching cleanly. Avoids reinventing the wheel.

**Alternative considered**: Raw `fetch` + `tar` streaming. More control, but significantly more code and error surface.

### D3: Version pinned in `package.json`, overridable

**Decision**: Embed `"typosVersion": "x.y.z"` in `typos-bin`'s own `package.json` as the default. Allow override via:
1. `TYPOS_BIN_VERSION` environment variable
2. `npm_config_typos_bin_version` npm config variable
3. `typos-bin.version` in the consumer's `package.json`

**Rationale**: Consistent with hugo-bin. Gives CI environments and monorepo setups flexibility to pin a specific version without changing the installed `typos-bin` version.

### D4: Binary stored in `vendor/` relative to project root

**Decision**: Store the downloaded binary in `vendor/typos` (or `vendor/typos.exe`) relative to the consuming project's root (resolved via `INIT_CWD`), not next to the package itself in `node_modules`.

**Rationale**: Keeps the binary outside `node_modules` (avoids being pruned), makes it inspectable, and is the established hugo-bin convention.

### D5: Release automation via GitHub Actions

**Decision**: A GitHub Actions workflow checks for new typos releases on a schedule, bumps `typosVersion` in `package.json`, and publishes to npm automatically.

**Rationale**: typos releases too frequently for manual tracking. Automation keeps `typos-bin` current with zero maintenance burden.

## Risks / Trade-offs

- **`--ignore-scripts` breaks install** → Shim detects missing binary and prints a clear error message directing the user to re-run install without `--ignore-scripts`. No lazy-install complexity.
- **Network failure at install time** → `bin-wrapper` will throw; npm install exits non-zero. Users see a clear error. No retry logic in scope (npm itself can be re-run).
- **GitHub rate limiting** → The download is from `github.com/releases`, not the API. Rate limiting is not a concern for binary downloads. The automation workflow uses `GITHUB_TOKEN`.
- **Proxy environments** → Users can set `TYPOS_BIN_DOWNLOAD_REPO` to a mirror URL. Documented in README.

## Open Questions

- **Checksum verification**: Should we verify SHA256 of downloaded archives? `bin-wrapper` does not do this natively. Out of scope for v1, worth a follow-up.

## Resolved Decisions

- **npm package name**: `@ocular-d/typos-bin` (scoped). Users install with `npm install --save-dev @ocular-d/typos-bin` and invoke via `npx @ocular-d/typos-bin` or the `typos` bin alias.
