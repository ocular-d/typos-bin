import { rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import createTyposBin from './index.js';

/**
 * Resolve the consuming project's root directory.
 *
 * During `npm install`, INIT_CWD is set to the directory where the user ran
 * `npm install` (npm >= 5.4). If it is not available, fall back to process.cwd()
 * and walk up when we detect that we're nested inside node_modules.
 *
 * @returns {string}
 */
function getProjectRoot() {
	const initCwd = process.env.INIT_CWD;
	if (initCwd) {
		return initCwd;
	}

	const cwd = process.cwd();
	const parts = cwd.split(path.sep);

	// If cwd ends with node_modules/<pkg-name>, go up two levels
	if (parts.length > 1 && parts.at(-2) === 'node_modules') {
		return path.resolve(cwd, '../../');
	}

	return cwd;
}

async function main() {
	const projectRoot = getProjectRoot();

	// The binary is stored inside the package's own vendor/ dir (in node_modules).
	// We resolve it via createTyposBin so the path is always consistent with
	// what the CLI shim and JS API resolve.
	const bin = await createTyposBin(projectRoot);

	// Clean up any previously downloaded binary before re-downloading.
	await rm(bin.dest(), { force: true, recursive: true });

	try {
		await bin.run(['--version']);
		console.log('typos binary successfully installed!');
	} catch (error) {
		console.error('typos binary installation failed!');
		throw new Error(error instanceof Error ? error.message : String(error));
	}
}

main();
