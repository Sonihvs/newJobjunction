const pool = require('../config/db');

// Create a new user in the database
const createUser = async (name, email, phone, password, city) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, phone, password, city) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, email, phone, password, city]
    );
    return result.rows[0];
};

// Find a user by email
const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail
};
