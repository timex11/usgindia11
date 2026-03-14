const { spawnSync } = require('child_process');
const path = require('path');

console.log('Building Next.js...');

const nextPath = path.resolve('./node_modules/next/dist/bin/next');
const result = spawnSync('node', [nextPath, 'build'], { 
  stdio: 'inherit',
  shell: false 
});

if (result.status !== 0) {
  console.error('Build failed');
  process.exit(1);
}
