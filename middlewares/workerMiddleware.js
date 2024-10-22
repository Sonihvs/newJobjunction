const jwt = require('jsonwebtoken');

// Middleware to authenticate worker using JWT
const authenticateWorkerToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided.' });
    }

    console.log('Received Token:', token);  // Log received token

    try {
        // Verify the token and attach worker data to req
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded);  // Log the decoded JWT payload

        req.worker = decoded; // Assuming 'decoded' contains worker details like 'srno'
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);  // Log the error details
        res.status(400).json({ message: 'Invalid token. by worker' });
    }
};

module.exports = authenticateWorkerToken;
