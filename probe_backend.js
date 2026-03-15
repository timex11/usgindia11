const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  process.stdout.write(`STATUS: ${res.statusCode}\n`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    process.stdout.write(`BODY: ${chunk}\n`);
  });
});

req.on('error', (e) => {
  process.stdout.write(`problem with request: ${e.message}\n`);
});

req.end();
