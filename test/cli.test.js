import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, renameSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const binPath = fileURLToPath(new URL('../bin/typos', import.meta.url));
const vendorDir = fileURLToPath(new URL('../vendor/', import.meta.url));
const binaryPath = path.join(vendorDir, 'typos');

describe('CLI shim', () => {
	it('exits with code 1 and prints an error when binary is missing', async () => {
		// Temporarily rename the binary if it exists so we can test the missing case
		const tmpPath = binaryPath + '.bak';
		const existed = existsSync(binaryPath);
		if (existed) renameSync(binaryPath, tmpPath);

		try {
			await execFileAsync(process.execPath, [binPath], { encoding: 'utf8' });
			assert.fail('Expected non-zero exit');
		} catch (error) {
			assert.equal(error.code, 1);
			assert.ok(
				error.stderr.includes('typos binary was not found') ||
					error.stderr.includes('--ignore-scripts'),
				`Unexpected stderr: ${error.stderr}`,
			);
		} finally {
			if (existed) renameSync(tmpPath, binaryPath);
		}
	});

	it('runs --version and exits 0 when binary is installed', { skip: !existsSync(binaryPath) }, async () => {
		const { stdout } = await execFileAsync(process.execPath, [binPath, '--version'], {
			encoding: 'utf8',
		});
		assert.match(stdout, /typos \d+\.\d+\.\d+/);
	});
});
