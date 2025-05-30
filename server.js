const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const db = require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files - More specific static file serving
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// Create uploads directory for CVs if it doesn't exist
const fs = require('fs');
const uploadDir = './uploads/cv';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Import routes
const usersRouter = require('./routes/users');
const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const auth = require('./middleware/auth');

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', auth, applicationsRouter);

// HTML Routes with explicit error handling
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('Error sending index.html:', err);
                res.status(500).send('Error loading page');
            }
        });
    } else {
        console.error('index.html not found at:', indexPath);
        res.status(404).send('Homepage not found');
    }
});

const sendFile = (filename) => (req, res) => {
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error sending ${filename}:`, err);
                res.status(500).send('Error loading page');
            }
        });
    } else {
        console.error(`${filename} not found at:`, filePath);
        res.status(404).send('Page not found');
    }
};

app.get('/about', sendFile('about.html'));
app.get('/contact', sendFile('contact.html'));
app.get('/job-seekers', sendFile('job-seekers.html'));
app.get('/recruiters', sendFile('recruiters.html'));
app.get('/signup', sendFile('signup.html'));

// Test API endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Test database endpoint
app.get('/api/db-test', (req, res) => {
    db.query('SELECT 1 + 1 AS result', (err, results) => {
        if (err) {
            console.error('Database test error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Database is connected!', results });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 with more information
app.use((req, res) => {
    console.log('404 - Not Found:', req.url);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    res.status(404).sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            console.error('Error sending 404 page:', err);
            res.status(404).send('Page not found');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log('Available routes:');
    console.log(`1. Homepage: http://localhost:${port}`);
    console.log(`2. API Test: http://localhost:${port}/api/test`);
    console.log(`3. DB Test: http://localhost:${port}/api/db-test`);
    
    // Log the existence of important files
    const files = ['index.html', 'about.html', 'contact.html', 'job-seekers.html', 'recruiters.html', 'signup.html'];
    files.forEach(file => {
        const exists = fs.existsSync(path.join(__dirname, file));
        console.log(`${file}: ${exists ? '✅ Found' : '❌ Not found'}`);
    });
});
