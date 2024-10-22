const pool = require('../config/db');

// Create a new worker in the database
const createWorker = async (name, email, phone, password, area, worktype, city) => {
    const result = await pool.query(
        'INSERT INTO workers (name, email, phone, password, area, worktype, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, email, phone, password, area, worktype, city]
    );
    return result.rows[0];
};

// Find a worker by email
const findWorkerByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM workers WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

module.exports = {
    createWorker,
    findWorkerByEmail
};
