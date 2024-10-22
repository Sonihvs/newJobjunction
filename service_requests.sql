CREATE TABLE service_requests (
    request_id SERIAL PRIMARY KEY,       
    user_id INT NOT NULL,                
    user_phone VARCHAR(15) NOT NULL,      
    email VARCHAR(100) NOT NULL,         
    user_name VARCHAR(100) NOT NULL, 
    city VARCHAR(100) Not NUll       
    area VARCHAR(100) NOT NULL,          
    payment_type VARCHAR(50) NOT NULL,    
    worker_id INT,                       
    work_type VARCHAR(100) NOT NULL,      
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    accept_reject BOOLEAN DEFAULT FALSE,  
    completed_status BOOLEAN DEFAULT FALSE  
);