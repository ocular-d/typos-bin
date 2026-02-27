## ADDED Requirements

### Requirement: Package exports the resolved binary path
The package's main entry point SHALL export the absolute path to the downloaded typos binary as the default export, enabling programmatic use without shelling out through the CLI shim.

#### Scenario: Import binary path
- **WHEN** a Node.js script does `import typossPath from 'typos-bin'`
- **THEN** `typosPath` is an absolute string path to the `vendor/typos` binary

#### Scenario: Use with execFile
- **WHEN** a script uses `execFile(typosPath, ['--version'], callback)`
- **THEN** the binary executes and the callback receives the version output

### Requirement: API resolves binary relative to the calling module's project root
The exported path SHALL resolve the binary location relative to the consuming project's root, consistent with where the postinstall script placed it.

#### Scenario: Correct path in monorepo
- **WHEN** `typos-bin` is imported from within a monorepo workspace
- **THEN** the returned path points to the binary in the workspace's own `vendor/` directory
