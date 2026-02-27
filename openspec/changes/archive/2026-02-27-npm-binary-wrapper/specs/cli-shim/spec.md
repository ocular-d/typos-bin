## ADDED Requirements

### Requirement: typos binary is accessible as a CLI command
The package SHALL expose a `typos` binary shim in its `bin` field so that `npx typos`, `npm exec typos`, and npm script references to `typos` all invoke the downloaded binary.

#### Scenario: Run via npx
- **WHEN** a user runs `npx typos --version` in a project with `typos-bin` installed
- **THEN** the shim resolves the vendor binary path and execs it, printing the typos version string

#### Scenario: Use in npm scripts
- **WHEN** a project's `package.json` defines `"lint:typos": "typos ."` and the user runs `npm run lint:typos`
- **THEN** the typos binary runs with `.` as the argument and exits with the same code as the binary

### Requirement: All arguments are forwarded verbatim to the binary
The shim SHALL pass all arguments received from `process.argv.slice(2)` directly to the typos binary without modification, and SHALL inherit stdin/stdout/stderr.

#### Scenario: Arguments are forwarded
- **WHEN** the user runs `npx typos src/ --format json`
- **THEN** the binary receives `['src/', '--format', 'json']` as its argv

#### Scenario: Exit code is preserved
- **WHEN** the typos binary exits with a non-zero code (e.g., typos found)
- **THEN** the shim process exits with the same non-zero code

### Requirement: Missing binary produces a clear error
If the vendor binary does not exist (e.g., postinstall was skipped with `--ignore-scripts`), the shim SHALL exit with code 1 and print a human-readable error message.

#### Scenario: Binary missing after --ignore-scripts
- **WHEN** the shim is invoked but `vendor/typos` does not exist
- **THEN** the shim prints an error explaining the binary is missing and instructs the user to re-run `npm install` without `--ignore-scripts`, then exits with code 1
