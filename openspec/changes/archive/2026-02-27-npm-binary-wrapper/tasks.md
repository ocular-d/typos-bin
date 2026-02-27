## 1. Project Setup

- [x] 1.1 Confirm `@ocular-d` npm org access and that `@ocular-d/typos-bin` is available on the registry
- [x] 1.2 Update `package.json` with correct name, description, `"type": "module"`, `engines`, `files`, `bin`, and `typosVersion` fields
- [x] 1.3 Add runtime dependencies: `@xhmikosr/bin-wrapper`, `package-config`
- [x] 1.4 Add dev dependencies: a test runner (e.g., `node:test` built-in), linter config
- [x] 1.5 Create `.gitignore` entries for `vendor/` and `node_modules/`
- [x] 1.6 Create `.npmignore` (or `files` allowlist) to exclude test files, openspec, and `.github` from the published package

## 2. Binary Download (postinstall)

- [x] 2.1 Create `lib/index.js` — platform target map (darwin arm64/x64, linux arm64/x64) with typos release asset names
- [x] 2.2 Implement `getOptions()` in `lib/index.js` — resolve `typosVersion` and `downloadRepo` from env vars, npm config, consumer `package.json` (via `package-config`), falling back to `typosVersion` in own `package.json`
- [x] 2.3 Implement `createBin()` in `lib/index.js` — construct `BinWrapper` with `.src()` entries for each platform target, `.dest(vendorDir)`, `.use('typos')`
- [x] 2.4 Implement `getProjectRoot()` in `lib/install.js` — resolve project root via `INIT_CWD` with fallback heuristic
- [x] 2.5 Create `lib/install.js` — postinstall entry point: resolve root, clear `vendor/`, call `createBin()`, run binary with `['--version']` to verify, log success/failure
- [x] 2.6 Wire `lib/install.js` as `"postinstall"` script in `package.json`
- [ ] 2.7 Test manually: `npm install` in a separate test project downloads and verifies the binary

## 3. CLI Shim

- [x] 3.1 Create `bin/typos` — resolve `vendor/typos` path, check existence, spawn with `process.argv.slice(2)` and `stdio: 'inherit'`, forward exit code
- [x] 3.2 Handle missing binary case: print actionable error message, exit with code 1
- [x] 3.3 Make `bin/typos` executable (`chmod +x`) and verify it is included in the npm package `files`
- [x] 3.4 Wire `"typos": "bin/typos"` in the `bin` field of `package.json`

## 4. JavaScript API

- [x] 4.1 Create `index.js` — import `lib/index.js`, resolve binary path, export as default
- [x] 4.2 Verify the exported path is correct when the package is consumed from a different working directory (e.g., monorepo workspace)

## 5. Tests

- [x] 5.1 Unit test: `getOptions()` correctly prioritises env var → npm config → package.json config → default
- [x] 5.2 Unit test: platform target map covers all four supported platforms and returns correct asset filenames
- [x] 5.3 Integration test: run `bin/typos --version` after install and assert output matches expected version string
- [x] 5.4 Integration test: run `bin/typos` without vendor binary present and assert exit code 1 and error message
- [x] 5.5 Add `"test"` script to `package.json`

## 6. Release Automation

- [x] 6.1 Create `.github/workflows/release.yml` — scheduled (daily) + `workflow_dispatch` trigger
- [x] 6.2 Implement version-check step: fetch latest typos release tag from GitHub API, compare to current `typosVersion` in `package.json`
- [x] 6.3 Implement bump step: update `typosVersion` and `version` in `package.json`, commit and push
- [x] 6.4 Implement publish step: `npm publish` (with `NODE_AUTH_TOKEN` secret)
- [ ] 6.5 Add `NPM_TOKEN` secret to repository settings
- [ ] 6.6 Do a manual dry-run of the workflow to verify end-to-end

## 7. Documentation & Polish

- [x] 7.1 Write `README.md`: install, CLI usage, npm script usage, JS API usage, config options (`typosVersion`, `downloadRepo`), supported platforms
- [ ] 7.2 Add `CHANGELOG.md` or release note template for the automation workflow to populate
- [ ] 7.3 Publish `v1.43.5` (or current latest) as the first release to npm manually to bootstrap
