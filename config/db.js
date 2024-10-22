// const { Pool } = require('pg');
// require('dotenv').config();

// // Create a new pool instance for connecting to PostgreSQL
// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
// });

// module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

// Check if DATABASE_URL is provided (for production) or use individual environment variables (for development)
const connectionString = process.env.DATABASE_URL || {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
};

// Create a new pool instance for connecting to PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // This is for Render or other platforms providing a full URL
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Enable SSL for production
});

module.exports = pool;

