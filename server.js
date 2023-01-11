const mysql = require('mysql2');
const inquirer = require('inquirer');
require("console.table");
const Connection = require('mysql2/typings/mysql/lib/Connection');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {host: 'localhost', port: 3001, user: 'root', password: '', database: 'employeeDatabase'},
  console.log(`You have connected to the employeeDatabase database.`)
);

Connection.connect(function (err) {
    if (err) throw (err);
    cli_prompt()
});

function initialPrompt(){

inquirer
    .prompt({
        type: "list",
        name: "task",
        Message: "Hi, what would you like to do?",
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
    .then(function ({task}) {
        if (task === "View Employees") {
            viewEmployee();
        } else if (task === "View Employees By Department") {
            viewEmployeeByDepartment();
        } else if (task === "Add New Employee") {
            addNewEmployee();
        } else if (task === "Remove Employee") {
            removeEmployee();
        } else if (task === "Update Existing Employee Role") {
            updateEmployeeRole();
        } else if (task === "Add New Roles") {
            addNewRoles();
        } else if (task === "End") {
            connection.end();
        }
    });
}    
function viewEmployee() {
    console.log("Viewing current employees");

    let query = 
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, '', m.last_name) AS manager
    FROM employee
    JOIN role
    ON employee.role_id = role.id
    JOIN department
    ON department.id = role.department_id
    JOIN employee manager
    ON manager.id = employee.manager_id`

    connection.query(query, (err, res)=> {
        if (err) throw err;
        console.table(res);
        initialPrompt();
    });
}










function viewEmployeeByDepartment() {
    console.log("Viewing employees by department");

    let query = ` SELECT department.id, department.name, department.salary AS budge
    FROM employee
    JOIN role
    ON employee.role_id = role.id
    JOIN department
    ON department.id = role.department.id
    GROUP BY department.id, department.name`

    connection.query(query, function (err, res) {
        if (err) throw err;
    

    const departmentChoices = res.map(data => ({
        value: data.id, name: data.name
    }));

    console.table(res);
    console.log("Viewing department now");

    promptDepartment(departmentChoices);
});

}

function promptDepartment(departmentChoices) {

    inquirer
    .propmt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to see?",
            choice: departmentChoices
        }
    ])
    .then(function (answer) {
        console.log("answer ", answer.departmentId);

        let query = 
        ` SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
        FROM employee
        JOIN role
        ON employee.role_id = role.id
        JOIN department
        ON department.id = role.department_id
        WHERE department.id = ?`

        connection.query(query, answer.departmentId, function (err, res) {
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
    `Select role.id, role.title, role.salary 
    FROM role`

    connection.query(query, function (err, res) {
        if (err) throw err;
        
        const roleChoices = res.map(({ id, title, salary })=> ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log(RoleToInsert);

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
            Message: "What is your new employees last name?"
        },
        {
            type: "input",
            name: "role_id",
            Message: "What is your new employees role?"
        },
    ])
    .then(function (answer) {
        console.log(answer);

        let query = `INSERT INTO employee SET ?`
        connection.query(query, 
            { first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id,
              manager_id: answer.managerId,
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
            name: "employeeId",
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
    console.log("Updating an employee");

    let query = 
    ` SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,  ' ', manager.last_name) AS manager
    FROM employee
    JOIN role
    ON employee.role_id = role.id
    JOIN department
    ON department.id = role.department_id
    JOIN employee
    ON manager.id = e.manager_id`
    
    connection.query(query, function (err, res) {
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
    let roleChoices;

    connections.query(query, function (err, res) {
        if (err) throw err;

        roleChoices = res.map(({id, title, salary}) => ({
            vaue: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log("roleArray to update shortly")

        promptEmployeeRole(employeeChoices, roleChoices);
    });
}


function promptEmployeeRole(employeeChoices, roleChoices) {

    inquirer
    .prompt([
        {
            type: "list",
            name: "employeeId",
            message: " Which employee will you set this role too?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "roleId",
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




function addNewRoles() {

    let query = 
    `SELECT department.id, department.name, role.salary AS budget
    FROM employee
    JOIN role
    ON employee.role_id = role.id
    JOIN department
    ON department.id = role.department_id
    GROUP BY department_id, department_name`

    connection.qeury(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(({ id, name }) => ({
            value: id, name: `${id} ${name}`
        }));

        console.table(res);
        console.log("Department array!");

        promptAddRole(departmentChoices);
    });
}

function promptAddRole(departmentChoices) {
    inquirer
    .prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "Role Title?"
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Role Salary"
            },
            {
                type: "list",
                name: "departmentId",
                message: "Which department",
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







app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  