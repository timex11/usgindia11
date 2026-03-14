const { spawn } = require('child_process');
const path = require('path');

process.stdout.write('Starting backend with spawn...\n');

const child = spawn('node', ['dist/main.js'], {
  cwd: path.resolve(__dirname, 'backend'),
  stdio: 'pipe'
});

child.stdout.on('data', (data) => {
  process.stdout.write(`STDOUT: ${data}`);
});

child.stderr.on('data', (data) => {
  process.stdout.write(`STDERR: ${data}`);
});

child.on('close', (code) => {
  process.stdout.write(`Child process exited with code ${code}\n`);
  process.exit(code);
});

setTimeout(() => {
  process.stdout.write('Timeout reached, killing child...\n');
  child.kill();
  process.exit(0);
}, 20000);
