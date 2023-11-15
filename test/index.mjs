import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// this ensures that the typical case works
function testOne() {
  const result = spawnSync('npm', ['run', 'run-binode-esm', '--silent'], {
    cwd: __dirname,
  });
  const stderr = result.stderr.toString();
  const stdout = result.stdout.toString();

  if (result.status !== 0) {
    throw new Error(
      `
npm run run-binode-esm failed with status ${result.status}:

--------- stderr ---------
${stderr}

--------- stdout ---------
${stdout}
        `.toString()
    );
  }

  if (!stderr.includes('Debugger listening')) {
    throw new Error(`--inspect flag not set: \n\n${stderr}`);
  }

  if (!stdout.includes('🐮')) {
    throw new Error(`--import is not working\n\n${stdout}`);
  }

  if (!stdout.includes('futile')) {
    throw new Error(`"futile" not found in output\n\n${stdout}`);
  }
}

// this handles when the package name and the bin name are different
function testTwo() {
  const [nodePath] = process.argv;
  const result = spawnSync('npm', ['run', 'run-binode-pkg-esm', '--silent'], {
    cwd: __dirname,
  });
  const stderr = result.stderr.toString();
  const stdout = result.stdout.toString();

  if (result.status !== 0) {
    throw new Error(
      `
npm run run-binode-pkg-esm failed with status ${result.status}:

--------- stderr ---------
${stderr}

--------- stdout ---------
${stdout}
        `.toString()
    );
  }

  if (!stderr.includes('Debugger listening')) {
    throw new Error(`--inspect flag not set: \n\n${stderr}`);
  }

  if (!stdout.includes(nodePath)) {
    throw new Error(`node path not found in the output: \n\n${stdout}`);
  }
}

// this ensures that the node --require happens in the same process as the spawned script
function testThree() {
  const [nodePath] = process.argv;
  const result = spawnSync('npm', ['run', 'run-binode-ctx-esm', '--silent'], {
    cwd: __dirname,
  });
  const stderr = result.stderr.toString();
  const stdout = result.stdout.toString();

  if (result.status !== 0) {
    throw new Error(
      `
npm run run-binode-ctx-esm failed with status ${result.status}:

--------- stderr ---------
${stderr}

--------- stdout ---------
${stdout}
        `.toString()
    );
  }
}

try {
  testOne();
} catch (error) {
  console.error('❌ test one failed');
  throw error;
}

try {
  testTwo();
} catch (error) {
  console.error('❌ test two failed');
  throw error;
}

try {
  testThree();
} catch (error) {
  console.error('❌ test three failed');
  throw error;
}

console.log('✅ MJS Tests passed!');
