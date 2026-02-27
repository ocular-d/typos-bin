# @ocular-d/typos-bin

> Binary wrapper for [typos](https://github.com/crate-ci/typos) — a fast, low false-positive spell checker for source code

Effortlessly add typos to any npm, pnpm, or Yarn project without a separate Rust or system installation.

## Install

```sh
npm install --save-dev @ocular-d/typos-bin
```

```sh
pnpm add --save-dev @ocular-d/typos-bin
```

```sh
yarn add --dev @ocular-d/typos-bin
```

The correct typos binary for your platform is automatically downloaded during install.

**Supported platforms:** macOS (arm64, x64), Linux (arm64, x64)

## Usage

### CLI

```sh
# via npx
npx typos .

# via npm exec
npm exec typos -- --format json .
```

### npm scripts

```json
{
  "scripts": {
    "lint:spell": "typos .",
    "lint:spell:fix": "typos --write-changes ."
  }
}
```

### JavaScript API

```js
import { execFile } from 'node:child_process';
import typosPath from '@ocular-d/typos-bin';

execFile(typosPath, ['--version'], (error, stdout) => {
  if (error) throw error;
  console.log(stdout); // typos 1.43.5
});
```

## Configuration options

Options can be set in three ways (listed by priority, highest first):

### Environment variables

```sh
TYPOS_BIN_VERSION=1.42.0          # use a specific typos version
TYPOS_BIN_DOWNLOAD_REPO=https://… # use a custom mirror (proxy/corporate network)
```

### `.npmrc`

```ini
typos_bin_version=1.42.0
typos_bin_download_repo=https://mirror.example.com
```

### `package.json`

```json
{
  "typos-bin": {
    "version": "1.42.0",
    "downloadRepo": "https://mirror.example.com"
  }
}
```

> **Note:** After changing any option, re-run your package manager install to re-download the binary.

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `version` | bundled version | Specific typos version to download |
| `downloadRepo` | `https://github.com` | Base URL for binary downloads (useful behind corporate proxies) |

## Troubleshooting

### Binary not found after install

If you see `The typos binary was not found`, your install was likely run with `--ignore-scripts`. Re-run without that flag:

```sh
npm install
```

## License

MIT