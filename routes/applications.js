const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/cv')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: CV must be PDF or Word document!');
    }
  }
});

// Submit a job application
router.post('/:jobId', upload.single('cv'), async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { applicant_name, applicant_email, applicant_phone, applicant_location } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'CV file is required' });
    }
    
    // First check if job exists and is active
    const checkJobQuery = 'SELECT id FROM jobs WHERE id = ? AND status = "active"';
    db.query(checkJobQuery, [jobId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking job status' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Job not found or inactive' });
      }
      
      // Proceed with application
      const query = `INSERT INTO job_applications (
        job_id, applicant_name, applicant_email, applicant_phone,
        applicant_location, cv_path
      ) VALUES (?, ?, ?, ?, ?, ?)`;
      
      db.query(query, [
        jobId, applicant_name, applicant_email, applicant_phone,
        applicant_location, req.file.path
      ], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error submitting application' });
        }
        res.status(201).json({ 
          message: 'Application submitted successfully',
          applicationId: results.insertId 
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications for a job (for job poster)
router.get('/job/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id; // Will be set by auth middleware
    
    // First check if user owns the job
    const checkOwnerQuery = 'SELECT user_id FROM jobs WHERE id = ?';
    db.query(checkOwnerQuery, [jobId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking job ownership' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Job not found' });
      }
      if (results[0].user_id !== userId) {
        return res.status(403).json({ message: 'Not authorized to view applications' });
      }
      
      // Get applications
      const query = 'SELECT * FROM job_applications WHERE job_id = ? ORDER BY created_at DESC';
      db.query(query, [jobId], (err, applications) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching applications' });
        }
        res.json(applications);
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status
router.put('/:id/status', async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id; // Will be set by auth middleware
    
    // Check if user owns the job this application is for
    const checkQuery = `
      SELECT j.user_id 
      FROM jobs j 
      JOIN job_applications ja ON j.id = ja.job_id 
      WHERE ja.id = ?`;
    
    db.query(checkQuery, [applicationId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking ownership' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Application not found' });
      }
      if (results[0].user_id !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this application' });
      }
      
      // Update status
      const updateQuery = 'UPDATE job_applications SET status = ? WHERE id = ?';
      db.query(updateQuery, [status, applicationId], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ message: 'Error updating application status' });
        }
        res.json({ message: 'Application status updated successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 