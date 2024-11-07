const pool = require('../config/db');


const createServiceRequest = async (serviceRequest) => {
    const { user_id, user_phone, email, user_name, area, payment_type, work_type, request_date, city } = serviceRequest;
    const query = `
        INSERT INTO service_requests (user_id, user_phone, email, user_name, area, payment_type, work_type, request_date, city, time_slot, user_data, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
    `;
    const values = [user_id, user_phone, email, user_name, area, payment_type, work_type, request_date, city, time_slot, user_data, address];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Accept service request
const acceptServiceRequest = async (requestId, workerId) => {
    console.log(`Updating request: request_id=${requestId}, worker_id=${workerId}`);
    const result = await pool.query(
        'UPDATE service_requests SET worker_id = $1, accept_reject = true WHERE request_id = $2 RETURNING *',
        [workerId, requestId]
    );
    // console.log('Update result:', result);
    return result.rows[0];
};

// Reject service request
const rejectServiceRequest = async (requestId) => {
    const result = await pool.query(
        'UPDATE service_requests SET worker_id = NULL, accept_reject = false WHERE request_id = $1 RETURNING *',
        [requestId]
    );
    return result.rows[0];
};

module.exports = {
    createServiceRequest, 
    acceptServiceRequest,
    rejectServiceRequest
};
