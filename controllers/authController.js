const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

// Signup logic
const signup = async (req, res) => {
    const { name, email, phone, password, location } = req.body;

    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await createUser(name, email, phone, hashedPassword, location);

    res.status(201).json({ message: 'User created successfully', user: newUser });
};

// Login logic
const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.srno }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
};

module.exports = {
    signup,
    login
};
