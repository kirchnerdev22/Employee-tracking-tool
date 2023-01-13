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
        "View Departments",
        "View Roles",
        "View Employees by Department",
        "Add New Department", 
        "Add New Employee",
        "Add New Role",
        "Update Existing Employee Role",
        "End"
        ]
    })
    .then(({task}) => {
        if (task === "View Employees") {
            viewEmployee();
        } else if (task === "View Departments") {
            viewDepartment();
        } else if (task === "View Roles") {
            viewRole();
        } else if (task === "View Employees by Department") {
            viewEmployeeByDepartment();
        } else if (task === "Add New Department") {
            addNewDepartment();
        } else if (task === "Add New Employee") {
            addNewEmployee();
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

function viewDepartment() {
    console.log("Viewing current departments");

    let query = 
    `SELECT * FROM department`

    connection.query(query, (err, res)=> {
        if (err) throw err;
        console.table(res);
    });

    initialPrompt();
}

function viewRole() {
    console.log("Viewing current roles");

    let query = 
    `SELECT * FROM role`

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

        const deptChoices = res.map((department) => ({
            value: department.id, name: department.dept_name
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

function addNewDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "addDepartment",
            message: "What department are you adding?"
        }
    ])
    .then((answers) => {
        connection.query(`INSERT INTO department(dept_name) VALUE(?)`, answers.addDepartment, (err, res) => {
            if (err) throw err;

            console.table("response ", res);
            console.log(res.affectedRows + "Employees are shown");

            initialPrompt();
        })
    })

}








function addNewDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "addDepartment",
            message: "What department are you adding?"
        }
    ])
    .then((answers) => {
        connection.query(`INSERT INTO department(dept_name) VALUE(?)`, answers.addDepartment, (err, res) => {
            if (err) throw err;

            console.table("response ", res);
            console.log(res.affectedRows + "Employees are shown");

            initialPrompt();
        })
    })

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



function addNewRole() {
    console.log("Choose a department")

    var query = 
    `SELECT * FROM department`

    connection.query(query,(err, res) => {
        if (err) throw err;

        let departmentChoices = res.map(({ id, dept_name }) => ({
            value: id, name: dept_name
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
                message: "What is the department ID?",
                choices: departmentChoices
            },
        ])
        .then(function (answer) {

            let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";

            connection.query(query, [answer.role_title, answer.role_salary,
            answer.department_dept_name], function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log("Role insert complete");

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

initialPrompt();