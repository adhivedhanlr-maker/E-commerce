const http = require('http');

const data = JSON.stringify({
    secretKey: 'nexusadmin2024'
});

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/seed-admin',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Attempting to seed admin account...');

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response:', responseData);
        if (res.statusCode === 200) {
            console.log('\nSUCCESS! Admin account is ready.');
            console.log('Email: admin@nexusstore.com');
            console.log('Password: Admin@123');
        } else {
            console.log('\nFAILED. Make sure your backend server is running on port 5000.');
        }
        process.exit(0);
    });
});

req.on('error', (error) => {
    console.error('Error connecting to server:', error.message);
    console.log('\nIs your backend server running? (npm run dev)');
    process.exit(1);
});

req.write(data);
req.end();
