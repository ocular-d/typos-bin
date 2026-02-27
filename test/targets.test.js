import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { targets } from '../lib/index.js';

const SUPPORTED_PLATFORMS = [
	{ os: 'darwin', arch: 'arm64' },
	{ os: 'darwin', arch: 'x64' },
	{ os: 'linux', arch: 'x64' },
	{ os: 'linux', arch: 'arm64' },
];

describe('platform targets', () => {
	it('covers all four supported platforms', () => {
		for (const { os, arch } of SUPPORTED_PLATFORMS) {
			const match = targets.find((t) => t.os === os && t.arch === arch);
			assert.ok(match, `Missing target for ${os}/${arch}`);
		}
	});

	it('generates correct asset filenames for a given version', () => {
		const version = '1.43.5';
		const expected = {
			'darwin/arm64': `typos-v${version}-aarch64-apple-darwin.tar.gz`,
			'darwin/x64': `typos-v${version}-x86_64-apple-darwin.tar.gz`,
			'linux/x64': `typos-v${version}-x86_64-unknown-linux-musl.tar.gz`,
			'linux/arm64': `typos-v${version}-aarch64-unknown-linux-musl.tar.gz`,
		};

		for (const { os, arch, target, ext } of targets) {
			const key = `${os}/${arch}`;
			const filename = `typos-v${version}-${target}.${ext}`;
			assert.equal(filename, expected[key], `Wrong filename for ${key}`);
		}
	});

	it('all targets use tar.gz extension', () => {
		for (const t of targets) {
			assert.equal(t.ext, 'tar.gz', `Expected tar.gz for ${t.os}/${t.arch}`);
		}
	});
});
