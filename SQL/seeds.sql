USE employeeDatabase;

INSERT INTO department (dept_name)
VALUES ("Revenue"),
("Marketing"),
("Human resources"),
("Finance"),
("Information Technology");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 120000, 1),
("Sales Representative", 70000, 1),
("Marketing Manager", 120000, 2),
("Marketing Coordinator", 60000, 2),
("HR Manager", 120000, 3),
("HR Generalist", 80000, 3),
("Financial Manager", 150000, 4),
("Financial Analyst", 90000, 4),
("Systems Administrator", 90000, 5),
("IT Support Technician", 60000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Samantha", "Smith", 1, null),
("Michael", "Johnson", 2, 1),
("Joshua", "Williams", 2, 1),
("Ashley", "Brown", 3, null),
("Nicholas", "Garcia", 4, 4),
("Jessica", "Davis", 4, 4),
("Matthew", "Rodriguez", 5, null),
("Brittany", "Miller", 6, 7),
("Andrew", "Martinez", 6, 7),
("Amanda", "Anderson", 7, null),
("David", "Taylor", 8, 10),
("Ryan", "Thomas", 8, 10),
("Jonathan", "Hernandez", 9, null),
("Rachel", "Moore", 10, 13),
("Kevin", "Marten", 10, 13);