require('dotenv').config()
console.log(process.env.DATABASE_URI)
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: 'https://job-tracker-nine-ruby.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'))
})

// GET all applications
app.get('/api/applications', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM applications ORDER BY applied_date DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST new application
app.post('/api/applications/add', async (req, res) => {
  try {
    const { company, role, status, applied_date, deadline, notes, job_url } = req.body
    console.log("received the info" + company)
    
    const result = await pool.query(
      `INSERT INTO applications (company, role, status, applied_date, deadline, notes, job_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [company, role, status, applied_date, deadline, notes, job_url]
    )
    console.log("application added to the db")
    res.json(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
    
  }
})

// PUT update application
app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { company, role, status, deadline, notes, job_url } = req.body
    const result = await pool.query(
      `UPDATE applications 
       SET company=$1, role=$2, status=$3, deadline=$4, notes=$5, job_url=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [company, role, status, deadline, notes, job_url, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE application
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM applications WHERE id=$1', [id])
    res.json({ message: 'Application deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`See updates on http://localhost:${PORT}`)
})
