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

// The app reads only the committed real series in public/data (refreshed by the
// weekly data workflow), so the build has no network steps.

// Type-check (fails the build on type errors), then Vite build
run('npx', ['tsc', '--noEmit']);
// Refuse to build from a broken catalog (missing files, empty or malformed series)
run('node', ['scripts/validate-real-data.mjs']);
run('npx', ['vite', 'build']);
run('node', ['scripts/build-pages.mjs']);

console.log('\nci-build completed successfully.');
