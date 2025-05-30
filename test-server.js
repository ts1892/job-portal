const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Add request logging
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.get('/', function(req, res) {
    console.log('Handling root route');
    res.send(`
        <html>
            <head>
                <title>Test Page</title>
            </head>
            <body>
                <h1>Welcome to the Test Page</h1>
                <p>If you can see this, the server is working correctly!</p>
            </body>
        </html>
    `);
});

// Add a test API endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

app.listen(port, () => {
    console.log(`Test server running at http://localhost:${port}`);
    console.log('Try accessing:');
    console.log(`1. http://localhost:${port}`);
    console.log(`2. http://localhost:${port}/api/test`);
}); 