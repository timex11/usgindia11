const { spawn } = require('child_process');
const http = require('http');

function checkServer(retries = 60) {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3001/api/v1', (res) => {
            console.log(`Backend responded with status: ${res.statusCode}`);
            resolve(true);
        });

        req.on('error', (err) => {
            if (retries > 0) {
                // console.log(`Retrying... (${retries})`);
                setTimeout(() => checkServer(retries - 1).then(resolve).catch(reject), 1000);
            } else {
                reject(new Error('Server did not start in time. Last error: ' + err.message));
            }
        });
        req.end();
    });
}

async function verify() {
    console.log('Starting Backend Server (Direct Node)...');
    // Run directly from dist/main.js to avoid shell issues
    const backend = spawn('node', ['dist/main.js'], {
        cwd: '.',
        stdio: 'pipe'
    });

    backend.stdout.on('data', (data) => {
        console.log('[Backend]', data.toString().trim());
    });

    backend.stderr.on('data', (data) => {
        console.error('[Backend Err]', data.toString().trim());
    });

    try {
        console.log('Waiting for backend to be ready...');
        await checkServer();
        console.log('✅ Connection established to Backend API.');

        // Test Scholarships Endpoint
        console.log('Testing /api/v1/scholarships...');
        await new Promise((resolve, reject) => {
            http.get('http://localhost:3001/api/v1/scholarships', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log(`/scholarships status: ${res.statusCode}`);
                    if (res.statusCode === 200) {
                        console.log('✅ Scholarships endpoint working (returned 200 OK)');
                    } else {
                        console.error('❌ Scholarships endpoint failed:', res.statusCode);
                        console.error('Response:', data);
                    }
                    resolve();
                });
            }).on('error', reject);
        });

    } catch (err) {
        console.error('❌ Verification Failed:', err.message);
    } finally {
        console.log('Stopping Backend Server...');
        if (backend.pid) {
             try {
                // Use process.kill for direct node process
                process.kill(backend.pid);
             } catch (e) {
                 console.error('Kill failed:', e.message);
             }
        }
        process.exit(0);
    }
}

verify();
