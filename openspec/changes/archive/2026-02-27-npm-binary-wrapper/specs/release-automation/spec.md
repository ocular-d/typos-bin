## ADDED Requirements

### Requirement: New typos releases automatically trigger a typos-bin release
A GitHub Actions workflow SHALL detect new releases of the `crate-ci/typos` repository and automatically open a pull request or directly publish a new `typos-bin` version with the updated `typosVersion` in `package.json`.

#### Scenario: New typos release detected
- **WHEN** a new tag is published on `crate-ci/typos`
- **THEN** the GitHub Actions workflow updates `typosVersion` in `typos-bin`'s `package.json`, commits the change, and publishes a new version to npm

#### Scenario: No new typos release
- **WHEN** the workflow runs and the latest typos version matches the current `typosVersion`
- **THEN** the workflow exits successfully without making any changes

### Requirement: Workflow runs on a schedule
The release automation workflow SHALL run on a scheduled cron trigger (e.g., daily) in addition to being manually triggerable.

#### Scenario: Scheduled run
- **WHEN** the cron schedule fires
- **THEN** the workflow checks the latest typos release on GitHub and proceeds accordingly

#### Scenario: Manual trigger
- **WHEN** a maintainer triggers the workflow manually via `workflow_dispatch`
- **THEN** the workflow runs the same version-check-and-publish logic
