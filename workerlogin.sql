CREATE TABLE workers (
    srno SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    worktype VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL

);
