import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';
import { getOptions } from '../lib/index.js';

describe('getOptions()', () => {
	let savedEnv;

	beforeEach(() => {
		// Snapshot env vars we may mutate
		savedEnv = {
			TYPOS_BIN_VERSION: process.env.TYPOS_BIN_VERSION,
			TYPOS_BIN_DOWNLOAD_REPO: process.env.TYPOS_BIN_DOWNLOAD_REPO,
			npm_config_typos_bin_version: process.env.npm_config_typos_bin_version,
			npm_config_typos_bin_download_repo: process.env.npm_config_typos_bin_download_repo,
		};
		for (const key of Object.keys(savedEnv)) {
			delete process.env[key];
		}
	});

	afterEach(() => {
		for (const [key, value] of Object.entries(savedEnv)) {
			if (value === undefined) {
				delete process.env[key];
			} else {
				process.env[key] = value;
			}
		}
	});

	it('returns bundled default version when no overrides are set', () => {
		const { typosVersion } = getOptions({});
		assert.match(typosVersion, /^\d+\.\d+\.\d+$/);
	});

	it('strips leading v from version', () => {
		const { typosVersion } = getOptions({ version: 'v1.42.0' });
		assert.equal(typosVersion, '1.42.0');
	});

	it('env var TYPOS_BIN_VERSION takes highest priority', () => {
		process.env.TYPOS_BIN_VERSION = '1.0.0';
		const { typosVersion } = getOptions({ version: '9.9.9' });
		assert.equal(typosVersion, '1.0.0');
	});

	it('npm config variable takes priority over package.json config', () => {
		process.env.npm_config_typos_bin_version = '1.1.0';
		const { typosVersion } = getOptions({ version: '9.9.9' });
		assert.equal(typosVersion, '1.1.0');
	});

	it('package.json config takes priority over bundled default', () => {
		const { typosVersion } = getOptions({ version: '1.40.0' });
		assert.equal(typosVersion, '1.40.0');
	});

	it('defaults downloadRepo to github.com', () => {
		const { downloadRepo } = getOptions({});
		assert.equal(downloadRepo, 'https://github.com');
	});

	it('env var TYPOS_BIN_DOWNLOAD_REPO overrides download repo', () => {
		process.env.TYPOS_BIN_DOWNLOAD_REPO = 'https://mirror.example.com';
		const { downloadRepo } = getOptions({});
		assert.equal(downloadRepo, 'https://mirror.example.com');
	});
});
