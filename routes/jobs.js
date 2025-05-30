const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new job posting
router.post('/', async (req, res) => {
  try {
    const {
      job_title, company_name, category, job_type, experience_level,
      province, city, salary_min, salary_max, job_description,
      requirements, contact_name, contact_email, contact_phone
    } = req.body;
    
    const userId = req.user.id; // Will be set by auth middleware
    
    const query = `INSERT INTO jobs (
      user_id, job_title, company_name, category, job_type, 
      experience_level, province, city, salary_min, salary_max,
      job_description, requirements, contact_name, contact_email, contact_phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [
      userId, job_title, company_name, category, job_type,
      experience_level, province, city, salary_min, salary_max,
      job_description, requirements, contact_name, contact_email, contact_phone
    ], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating job posting' });
      }
      res.status(201).json({ message: 'Job posted successfully', jobId: results.insertId });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, job_type, province, city } = req.query;
    let query = 'SELECT * FROM jobs WHERE status = "active"';
    const params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (job_type) {
      query += ' AND job_type = ?';
      params.push(job_type);
    }
    if (province) {
      query += ' AND province = ?';
      params.push(province);
    }
    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }
    
    query += ' ORDER BY created_at DESC';
    
    db.query(query, params, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching jobs' });
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific job by ID
router.get('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const query = 'SELECT * FROM jobs WHERE id = ? AND status = "active"';
    
    db.query(query, [jobId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching job' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job posting
router.put('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id; // Will be set by auth middleware
    const updates = req.body;
    
    // First check if the user owns this job posting
    const checkQuery = 'SELECT user_id FROM jobs WHERE id = ?';
    db.query(checkQuery, [jobId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking job ownership' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Job not found' });
      }
      if (results[0].user_id !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this job' });
      }
      
      // Proceed with update
      const updateQuery = 'UPDATE jobs SET ? WHERE id = ?';
      db.query(updateQuery, [updates, jobId], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ message: 'Error updating job' });
        }
        res.json({ message: 'Job updated successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job posting (soft delete by setting status to inactive)
router.delete('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id; // Will be set by auth middleware
    
    // First check if the user owns this job posting
    const checkQuery = 'SELECT user_id FROM jobs WHERE id = ?';
    db.query(checkQuery, [jobId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking job ownership' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Job not found' });
      }
      if (results[0].user_id !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this job' });
      }
      
      // Proceed with soft delete
      const deleteQuery = 'UPDATE jobs SET status = "inactive" WHERE id = ?';
      db.query(deleteQuery, [jobId], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ message: 'Error deleting job' });
        }
        res.json({ message: 'Job deleted successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 