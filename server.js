const mysql = require('mysql2');
const inquirer = require('inquirer');
require("console.table");
const connection = mysql.createConnection(
  {host: 'localhost', port: 3306, user: 'root', password: 'Access1!', database: 'employeeDatabase'},
  console.log(`You have connected to the employeeDatabase database.`)
);

connection.connect((err) => {
    if (err) throw (err);
});

function initialPrompt(){

inquirer.prompt({
        type: "list",
        name: "task",
        message: "Hi, what would you like to do?",
        choices: [
        "View Employees",
        "View Employees by department", 
        "Add New Employee",
        "Remove Employee",
        "Update Existing Employee Role",
        "Add New Role",
        "End"
        ]
    })
    .then(({task}) => {
        if (task === "View Employees") {
            viewEmployee();
        } else if (task === "View Employees By department") {
            viewEmployeeByDepartment();
        } else if (task === "Add New Employee") {
            addNewEmployee();
        } else if (task === "Remove Employee") {
            removeEmployee();
        } else if (task === "Update Existing Employee Role") {
            updateEmployeeRole();
        } else if (task === "Add New Role") {
            addNewRole();
        } else if (task === "End") {
            connection.end();
        }
    });
}    

function viewEmployee() {
    console.log("Viewing current employees");

    let query = 
    `SELECT * FROM employee`

    connection.query(query, (err, res)=> {
        if (err) throw err;
        console.table(res);
    });

    initialPrompt();
}

function viewEmployeeByDepartment() {
    console.log("Viewing employees by department");

    let query = `SELECT * FROM department`

    connection.query(query,(err, res)=>{
        if (err) throw err;

        const deptChoices = res.map((choices) => ({
            value: choices.id, name: choices.title
        }));

        console.table(res);
        console.log("Viewing department now");

        promptDepartment(deptChoices);
    });
}

function promptDepartment(deptChoices) {

    inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to see?",
            choices: deptChoices
        }
    ]).then((res) => {
        console.log("answer ", res);

        let query = 
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, dept_name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id WHERE department.id = ?`

        connection.query(query, res.departmentId, (err, res) => {
            if (err) throw err;

            console.table("response ", res);
            console.log(res.affectedRows + "Employees are shown");

            initialPrompt();
        });
    });
}

function addNewEmployee() {
    console.log("Adding a new employee.")

    let query =
    `Select role.id, role.title, role.salary FROM role`

    connection.query(query, (err, res) => {
        if (err) throw err;
        
        const roleChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log(roleChoices);

        roleCriteria();

    });
}

function roleCriteria() {
    inquirer
    .prompt([
        {
            type: "input",
            name: "first_name",
            Message: "What is your new employees first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is your new employees last name?"
        },
        {
            type: "input",
            name: "role_id",
            message: "What is your new employees role?"
        },
        {
            type: "input",
            name: "manager_id",
            message: "What is your correct manager ID?"
        }
    ])
    .then(function (answer) {
        console.log(answer);

        let query = `INSERT INTO employee SET ?`
        connection.query(query, 
            { first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id,
              manager_id: answer.manager_id
            },
            function (err,res) {
                if (err) throw err;

                console.table(res);
                console.log(res.insertedRows + "Data logged succesfully!")

                initialPrompt();
            });
    });
}

function removeEmployee() {
    console.log("WARNING YOU ARE REMOVING AN EMPLOYEE");

    let query =
    `SELECT employee.id, employee.first_name, employee.last_name FROM EMPLOYEE`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("Will delete");

        promptDelete(deleteEmployeeChoices);
    });
}

function promptDelete(deleteEmployeeChoices) {
    inquirer
    .prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Which employee do you want to remove?",
            choices: deleteEmployeeChoices
        }
    ])
    .then(function(answer) {

        let query = ` DELETE FROM employee WHERE ?`;
        connection.query(query, {id: answer.employeeId }, function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log(res.affectedRows + "Deleted");

            initialPrompt();
        });
    });
}

function updateEmployeeRole() {
    employeeArray();
}

function employeeArray() {
    console.log("Select an employee role");

    let query = 
    ` SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee`
    
    connection.query(query,(err, res) => {
        if (err) throw err;

        const employeeChoices = res.map(({id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("employeeArray to update shortly")

        roleArray(employeeChoices)
    })
}

function roleArray(employeeChoices) {
    console.log("Updating a role")

    let query = 
    ` SELECT role.id, role.title, role.salary FROM role`

    connection.query(query,(err, res) => {
        if (err) throw err;

        let roleChoices = res.map(({id, title, salary}) => ({
            value: id, name: `${title}`
        }));

        console.table(res);
        console.log("roleArray to update shortly")

        promptEmployeeRole(employeeChoices, roleChoices);
    });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

    inquirer.prompt([
        {
            type: "list",
            name: "employee_id",
            message: " Which employee will you set this role too?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "role_id",
            message: " Which role would you like to update?",
            choices: roleChoices
        },
    ])
    .then(function (answer) {

        let query = `UPDATE employee SET role_id = ? WHERE id = ?`
        
        connection.query(query,
            [ answer.roleId,
            answer.employeeId
        ],
        function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log(res.affectedRows + "Update succesfull");
            
            initialPrompt();
        });
    });
}

function addNewRole() {
    console.log("Choose a department")

    var query = 
    `SELECT * FROM department`

    connection.query(query,(err, res) => {
        if (err) throw err;

        let departmentChoices = res.map(({ id, title }) => ({
            value: id, name: `${title}`
        }));

        console.table(res);
        console.log("Department array!");

        promptAddNewRole(departmentChoices);
    });
}

function promptAddNewRole(departmentChoices) {
    inquirer.prompt([
            {
                type: "input",
                name: "role_title",
                message: "Role Title?"
            },
            {
                type: "input",
                name: "role_salary",
                message: "Role Salary?"
            },
            {
                type: "list",
                name: "department_dept_name",
                message: "Which department?",
                choices: departmentChoices
            },
        ])
        .then(function (answer) {

            let query = `INSERT ROLE into SET?`

            connection.query(query, {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.departmentId
            },

            function (err, res) {
                if (err) throw err;

                console.table(res);
                console.log("Role insert complete");

                initialPrompt();
            });
            
        });
}

initialPrompt();