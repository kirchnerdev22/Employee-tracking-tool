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
            updateExistingEmployeeRole();
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
    `SELECT employee.id, employee.first_name, employee.last_name, employeeRole.title, department.name AS department, employeeRole.salary, CONCAT(m.first_name, '', m.last_name) AS manager`


}

function addNewEmployee() {
    console.log("Adding a new employee.")

    let query =
    `Select employeeRole.id, employeeRole.title, employeeRole.salary FROM emploeeRole`

    connection.query(query, function (err, res) {
        if (err) throw err;
        
        const roleChoices = res.map(({ id, title, salary })=> ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log(RoleToInsert);

        employeeRoleCriteria();

    });
}

function employeeRoleCriteria() {
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
            { first_name: answer.first_name, last_name: answer.last_name, employeeRole_id: answer.employeeRole_id },
            function (err,res) {
                if (err) throw err;

                console.table(res);
                console.log(res.insertedRows + "Data logged succesfully!")

                initialPrompt();
            });
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  