const { spawnSync } = require('child_process');
const path = require('path');

console.log('> SWC Running...');

const nestJsPath = path.resolve('./node_modules/@nestjs/cli/bin/nest.js');
const result = spawnSync('node', [nestJsPath, 'build'], { 
  stdio: 'inherit',
  shell: false 
});

if (result.status === 0) {
  console.log('Successfully compiled with swc');
} else {
  console.error('Build failed');
  process.exit(1);
}
