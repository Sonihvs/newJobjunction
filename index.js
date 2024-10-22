const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Routes
// http://localhost:3000/auth/signup , http://localhost:3000/auth/login 
//(after login it will give jwt token and to use it for next page views)
app.use('/auth', authRoutes); 

//http://localhost:3000/workers/signup , http://localhost:3000/workers/login
//(after login it will give jwt token and to use it for next page views)
app.use('/workers', workerRoutes); 
//http://localhost:3000/services/book-service
app.use('/services', bookingRoutes);

app.use('/service-requests', serviceRequestRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
