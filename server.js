const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000; // Use a different port from Next.js

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    user: '',
    host: 'localhost',
    database: 'abis',
    password: '',
    port: 5432,
});

// API endpoint to get top 10 job postings
app.get('/api/jobs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// API endpoint to get job posting by ID
app.get('/api/jobs/:id', async (req, res) => {
    const jobId = req.params.id; // Get the job ID from the request parameters

    try {
        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]); // Use parameterized queries to prevent SQL injection
        if (result.rows.length === 0) {
            return res.status(404).send('Job not found'); // Handle case where no job is found
        }
        res.json(result.rows[0]); // Return the job details
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error'); // Handle server errors
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});