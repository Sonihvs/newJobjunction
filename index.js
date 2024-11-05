const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Routes

//(after login it will give jwt token and to use it for next page views)
app.use('/auth', authRoutes); 


//(after login it will give jwt token and to use it for next page views)
app.use('/workers', workerRoutes); 

// for booking services 
app.use('/services', bookingRoutes);

// for accepting rejecting services for worker side
app.use('/service-requests', serviceRequestRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
