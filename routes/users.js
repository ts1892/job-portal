const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Users API is working!' });
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, first_name, last_name, company_name, company_size, phone_number } = req.body;
    
    // First check if username exists
    const checkQuery = 'SELECT id FROM users WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking existing user:', checkErr);
        return res.status(500).json({ message: 'Error checking user existence' });
      }

      if (checkResults.length > 0) {
        return res.status(400).json({ 
          message: checkResults[0].username === username ? 'Username already exists' : 'Email already exists'
        });
      }

      // If no existing user, proceed with registration
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const insertQuery = `INSERT INTO users (username, password, email, first_name, last_name, company_name, company_size, phone_number) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(insertQuery, [
          username, 
          hashedPassword, 
          email, 
          first_name, 
          last_name, 
          company_name, 
          company_size, 
          phone_number
        ], (err, results) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Error creating user' });
          }

          // Create JWT token
          const token = jwt.sign(
            { userId: results.insertId, username },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '24h' }
          );

          res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
              id: results.insertId,
              username,
              email,
              first_name,
              last_name,
              company_name,
              company_size,
              phone_number
            }
          });
        });
      } catch (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).json({ message: 'Error creating user' });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Log the login attempt
    console.log('Login attempt received:', { username });
    
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const query = 'SELECT * FROM users WHERE username = ?';
    console.log('Executing query:', query);
    
    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Database error occurred', error: err.message });
      }
      
      console.log('Query results:', results.length > 0 ? 'User found' : 'No user found');
      
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      const user = results[0];
      
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        // Create JWT token
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          process.env.JWT_SECRET || 'your_jwt_secret_key_here',
          { expiresIn: '24h' }
        );
        
        // Remove password from user object
        delete user.password;
        
        console.log('Login successful for user:', username);
        
        res.json({ 
          message: 'Login successful',
          token,
          user
        });
      } catch (bcryptError) {
        console.error('Password comparison error:', bcryptError);
        return res.status(500).json({ message: 'Error verifying password', error: bcryptError.message });
      }
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const query = 'SELECT id, username, email, first_name, last_name, company_name, company_size, phone_number FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(results[0]);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 