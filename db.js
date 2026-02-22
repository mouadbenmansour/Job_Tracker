const {Pool} = require('pg')
require('dotenv').config()


const pool = new Pool({
  host: 'aws-1-eu-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.asrjmjodvbdlbjkziuqp',
  password: 'SupaBasePas1',
  ssl: { rejectUnauthorized: false }
})


module.exports = pool
