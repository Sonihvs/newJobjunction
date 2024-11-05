const { acceptServiceRequest, rejectServiceRequest } = require('../models/serviceRequestModel');
const sendEmail = require('../services/emailService');
const pool = require('../config/db');

// Accept a service request
// const acceptRequest = async (req, res) => {
//     const { requestId } = req.body;
//     const workerId = req.worker.workerId; // Get worker's ID from the middleware

//     try {
//         const updatedRequest = await acceptServiceRequest(requestId, workerId);
//         return res.status(200).json({
//             message: 'Service request accepted successfully',
//             request: updatedRequest
//         });
//     } catch (error) {
//         console.error('Error accepting service request:', error);
//         return res.status(500).json({ error: 'Server error while accepting service request.' });
//     }
// };

const acceptRequest = async (req, res) => {
    const { requestId } = req.body; // Get requestId from the request body
    const workerId = req.worker.workerId; // Get workerId from the JWT middleware

    try {
        // Fetch the service request details before accepting it
        const serviceRequestQuery = 'SELECT * FROM service_requests WHERE request_id = $1';
        const serviceRequestResult = await pool.query(serviceRequestQuery, [requestId]);
        const serviceRequest = serviceRequestResult.rows[0];

        if (!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        // Fetch worker details
        const workerQuery = 'SELECT name, phone FROM workers WHERE srno = $1';
        const workerResult = await pool.query(workerQuery, [workerId]);
        const worker = workerResult.rows[0];

        // Log the worker details
        console.log('Worker details:', worker);

        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Accept the service request by updating the database
        const updatedRequest = await acceptServiceRequest(requestId, workerId);

        // Prepare email details
        const userEmail = serviceRequest.email;  // Email from service request data
        const userName = serviceRequest.user_name; // User name from service request data
        const workerName = worker.name; // Worker name
        const workerPhone = worker.phone; // Worker phone

        const subject = `Service Request Accepted - Request ID: ${requestId}`;
        const text = `Hello ${userName},\n\nYour service request (ID: ${requestId}) has been accepted by a worker.\n\nWorker Details:\nName: ${workerName}\nPhone: ${workerPhone}\n\nThank you for using our service!`;

        // Send the email using the email service
        await sendEmail(userEmail, subject, text);

        // Return a success response after updating the database and sending the email
        return res.status(200).json({
            message: 'Service request accepted successfully, and detailed email sent to the user',
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error accepting service request:', error);
        return res.status(500).json({ error: 'Server error while accepting service request.' });
    }
};


// Reject a service request
const rejectRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        const updatedRequest = await rejectServiceRequest(requestId);
        return res.status(200).json({
            message: 'Service request rejected successfully',
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error rejecting service request:', error);
        return res.status(500).json({ error: 'Server error while rejecting service request.' });
    }
};

module.exports = {
    acceptRequest,
    rejectRequest
};
