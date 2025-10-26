#!/usr/bin/env node
import { spawnSync } from 'child_process';

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`Command failed: ${cmd} ${args.join(' ')} (exit ${res.status})`);
    process.exit(res.status ?? 1);
  }
}

// If SKIP_PREFETCH is set to 'true' we skip the prefetch/generate-ai steps.
// Also, by default GitHub Actions sets CI=true; this script will skip network-heavy steps
// when running in CI unless FORCE_FULL_BUILD is set to 'true'.
const isCI = process.env.CI === 'true';
const skipPrefetch = process.env.SKIP_PREFETCH === 'true' || (isCI && process.env.FORCE_FULL_BUILD !== 'true');

console.log('ci-build starting. environment:', {
  CI: process.env.CI,
  SKIP_PREFETCH: process.env.SKIP_PREFETCH,
  FORCE_FULL_BUILD: process.env.FORCE_FULL_BUILD,
});

if (!skipPrefetch) {
  // run the original preparatory steps
  run('npm', ['run', 'prefetch']);
  run('npm', ['run', 'generate-ai']);
} else {
  console.log('Skipping prefetch and generate-ai (CI or SKIP_PREFETCH set).');
}

// TypeScript build and Vite build
run('npx', ['tsc', '-b', '--noCheck']);
run('npx', ['vite', 'build']);

console.log('\nci-build completed successfully.');
