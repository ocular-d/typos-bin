## ADDED Requirements

### Requirement: Platform binary is downloaded at install time
The package SHALL download the correct pre-built typos binary for the current platform during the npm postinstall lifecycle hook. Supported platforms are macOS arm64, macOS x64, Linux arm64, and Linux x64.

#### Scenario: Install on supported platform
- **WHEN** a user runs `npm install typos-bin` on a supported platform
- **THEN** the postinstall script downloads the matching typos binary tarball from GitHub Releases, extracts it, and stores the binary at `vendor/typos` relative to the consuming project root

#### Scenario: Install on unsupported platform
- **WHEN** a user runs `npm install typos-bin` on an unsupported platform (e.g., Windows)
- **THEN** the postinstall script exits with a non-zero code and prints a clear message stating the platform is not supported

### Requirement: Default version is pinned and overridable
The package SHALL embed a default typos version in its own `package.json` under the `typosVersion` key. The version SHALL be overridable without reinstalling `typos-bin` itself.

#### Scenario: Override via environment variable
- **WHEN** the `TYPOS_BIN_VERSION` environment variable is set to a valid typos version string (e.g., `1.42.0`)
- **THEN** the postinstall script downloads that version instead of the default

#### Scenario: Override via npm config
- **WHEN** `npm_config_typos_bin_version` is set in the environment
- **THEN** the postinstall script uses that version

#### Scenario: Override via consumer package.json
- **WHEN** the consuming project's `package.json` contains a `typos-bin.version` field
- **THEN** the postinstall script uses that version

#### Scenario: No override provided
- **WHEN** none of the override mechanisms are configured
- **THEN** the postinstall script uses the version embedded in `typos-bin`'s own `package.json`

### Requirement: Binary is stored in vendor/ at project root
The downloaded binary SHALL be stored at `vendor/typos` relative to the consuming project's root directory (resolved from `INIT_CWD` or `process.cwd()`).

#### Scenario: Binary path resolution during install
- **WHEN** the postinstall script runs inside `node_modules/typos-bin/`
- **THEN** it resolves the project root using `INIT_CWD` (npm >= 5.4) or a fallback heuristic, and writes the binary to `<projectRoot>/vendor/typos`

### Requirement: Download repository is overridable
The base download URL SHALL default to `https://github.com` and SHALL be overridable via `TYPOS_BIN_DOWNLOAD_REPO` env var, `npm_config_typos_bin_download_repo`, or `typos-bin.downloadRepo` in the consumer's `package.json`.

#### Scenario: Custom mirror configured
- **WHEN** `TYPOS_BIN_DOWNLOAD_REPO` is set to a mirror URL
- **THEN** the binary is downloaded from `<mirrorUrl>/crate-ci/typos/releases/download/v{version}/...`
