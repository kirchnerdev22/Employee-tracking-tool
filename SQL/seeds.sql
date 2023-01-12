USE employeeDatabase;

INSERT INTO department (department_name)
VALUES ("Revenue"),
("Engineering"),
("Management"),
("Human resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Revenue Lead", 100000, 1),
("Front-end Engineer", 150000, 2),
("Back-end Engineer", 120000, 3),
("Manager", 125000, 4),
("Insurance Director", 250000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Doe", 1, 1),
("John", "Wick", 2, 1),
("Joe", "Biden", 3, 1),
("Bill", "Nye", 4, 1),
("Daisy", "Duke", 5, 1),
("Mike", "Jones", 2, 1),
("Tom", "Riddle", 4, 1),
("Harry", "Potter", 1, 1);