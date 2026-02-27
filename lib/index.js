import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { debuglog } from 'node:util';
import BinWrapper from '@xhmikosr/bin-wrapper';
import { packageConfig } from 'package-config';

const debug = debuglog('typos-bin');

const pkg = new URL('../package.json', import.meta.url);
const { typosVersion: TYPOS_VERSION } = JSON.parse(await fs.readFile(pkg, 'utf8'));

export const destDir = path.join(
	fileURLToPath(new URL('../vendor/', import.meta.url)),
);

const binName = process.platform === 'win32' ? 'typos.exe' : 'typos';

/**
 * typos release asset targets.
 * Asset URL pattern:
 *   https://github.com/crate-ci/typos/releases/download/v{version}/typos-v{version}-{target}.tar.gz
 */
const targets = [
	// macOS
	{ os: 'darwin', arch: 'arm64', target: 'aarch64-apple-darwin', ext: 'tar.gz' },
	{ os: 'darwin', arch: 'x64', target: 'x86_64-apple-darwin', ext: 'tar.gz' },
	// Linux
	{ os: 'linux', arch: 'x64', target: 'x86_64-unknown-linux-musl', ext: 'tar.gz' },
	{ os: 'linux', arch: 'arm64', target: 'aarch64-unknown-linux-musl', ext: 'tar.gz' },
];

debug('[global] TYPOS_VERSION:', TYPOS_VERSION);
debug('[global] destDir:', destDir);
debug('[global] binName:', binName);

/**
 * Resolve the typos version and download repository from environment variables,
 * npm config, the consuming project's package.json, or the default bundled version.
 *
 * Priority: env var > npm config > package.json config > bundled default
 *
 * @param {import('package-config').Config} config
 * @returns {{ typosVersion: string, downloadRepo: string }}
 */
function getOptions(config) {
	const rawVersion = [
		process.env.TYPOS_BIN_VERSION,
		process.env.npm_config_typos_bin_version,
		config.version,
	].find(Boolean) ?? TYPOS_VERSION;

	const downloadRepo = [
		process.env.TYPOS_BIN_DOWNLOAD_REPO,
		process.env.npm_config_typos_bin_download_repo,
		config.downloadRepo,
	].find(Boolean) ?? 'https://github.com';

	// Strip any leading `v` to avoid duplicate `v` in the URL
	const typosVersion = rawVersion.startsWith('v') ? rawVersion.slice(1) : rawVersion;

	debug('[getOptions] %o', { typosVersion, downloadRepo });

	return { typosVersion, downloadRepo };
}

/**
 * Create a configured BinWrapper instance for the resolved typos version.
 *
 * @param {string} baseUrl  Base URL up to and including the release directory (with trailing slash)
 * @param {string} version  Typos version without leading `v`
 * @returns {BinWrapper}
 */
function createBin(baseUrl, version) {
	debug('[createBin] baseUrl: %s, version: %s', baseUrl, version);

	let bin = new BinWrapper();

	for (const { os, arch, target, ext } of targets) {
		const filename = `typos-v${version}-${target}.${ext}`;
		bin = bin.src(`${baseUrl}${filename}`, os, arch);
	}

	return bin.dest(destDir).use(binName);
}

/**
 * Build and return a BinWrapper for the calling project context.
 *
 * @param {string} cwd  The consuming project's root directory
 * @returns {Promise<BinWrapper>}
 */
async function main(cwd) {
	const config = await packageConfig('typos-bin', { cwd });
	const { typosVersion, downloadRepo } = getOptions(config);

	const baseUrl = `${downloadRepo}/crate-ci/typos/releases/download/v${typosVersion}/`;
	debug('[main] baseUrl: %s', baseUrl);

	return createBin(baseUrl, typosVersion);
}

export { getOptions, createBin, targets };
export default main;
