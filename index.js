import process from 'node:process';
import createTyposBin from './lib/index.js';

const bin = await createTyposBin(process.cwd());

/** Absolute path to the typos binary. */
const typosPath = bin.path();

export default typosPath;
