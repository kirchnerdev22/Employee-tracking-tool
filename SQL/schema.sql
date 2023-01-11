DROP DATABASE IF EXISTS employeeDatabase;
CREATE DATABASE employeeDatabase;
USE employeeDatabase;

CREATE TABLE department (
    id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    salary VARCHAR(100) NOT NULL,
    department_id INT NOT NULL
);


CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL
);

