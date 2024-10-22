const { createServiceRequest } = require('../models/serviceRequestModel');

const bookServiceController = async (req, res) => {
    try {
        const { user_id, user_phone, email, user_name, area, payment_type, work_type, city } = req.body;

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
            city
        });

        res.status(201).json({
            message: 'Service request created successfully',
            serviceRequest,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    bookServiceController,
};
