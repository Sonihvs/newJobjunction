const { createServiceRequest } = require('../models/serviceRequestModel');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 

const bookServiceController = async (req, res) => {
    try {
        //const { user_id, user_phone, email, user_name, area, payment_type, work_type, city } = req.body;


        const { user_phone, email, user_name, area, payment_type, work_type, city, time_slot, user_data, address } = req.body;
        const user_id = req.user.userId; // Extract user_id from req.user
        
        // Add current date as request_date
        const request_date = new Date();

        // Validate the work type to ensure it's either "painting" or "carpentry"
        if (!['painting', 'carpentry'].includes(work_type)) {
            return res.status(400).json({ error: "Invalid work type. Please select 'painting' or 'carpentry'." });
        }

        const serviceRequest = await createServiceRequest({
            user_id,
            user_phone,
            email,
            user_name,
            area,
            payment_type,
            work_type,
            request_date,
            city,
            time_slot,
            user_data,
            address
        });

        res.status(201).json({
            message: 'Service request created successfully',
            serviceRequest,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const pendingRequests = async (req, res) => {
    const userId = req.user.userId; // Worker ID from the JWT middleware

    try {
        const query = `
            SELECT * FROM service_requests
            WHERE user_id = $1 AND accept_reject = true AND completed_status = false;
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No pending service requests found for this user' });
        }

        res.status(200).json({
            message: 'pending service requests fetched successfully',
            acceptedRequests: result.rows
        });
    } catch (error) {
        console.error('Error fetching pending service requests:', error);
        res.status(500).json({ error: 'Server error while fetching pending service requests' });
    }
};

const getcompeletedRequests = async (req, res) => {
    const userId = req.user.userId; // Worker ID from the JWT middleware

    try {
        const query = `
            SELECT * FROM service_requests
            WHERE user_id = $1 AND accept_reject = true AND completed_status = true;
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No compeleted service requests found for this user' });
        }

        res.status(200).json({
            message: 'compeleted service requests fetched successfully',
            acceptedRequests: result.rows
        });
    } catch (error) {
        console.error('Error fetching compeleted service requests:', error);
        res.status(500).json({ error: 'Server error while fetching compeleted service requests' });
    }
};

module.exports = {
    bookServiceController,
    pendingRequests,
    getcompeletedRequests
};
