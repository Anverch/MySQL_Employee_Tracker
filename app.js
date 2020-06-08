var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeesDB"
});

connection.connect();

runSearch();

function runSearch() {
    var exit = false
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viwAllEmployees();
                    break;

                case "View All Roles":
                    viwAllRoles();
                    break;

                case "View All Departments":
                    viwAllDepartments();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Exit":
                    exit = true;
                    connection.end();
                    break;
            }
        })
}

// Connection function for all View Data requests 
function executeQueryNoResult(query) {
    connection.query(query, function (err, res) {
        if (err) {
            throw err;
        }
        console.table(res);
        runSearch();
        return
    })
}

function viwAllEmployees() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"

    executeQueryNoResult(query);
}

function viwAllRoles() {
    var query = "SELECT * FROM role"

    executeQueryNoResult(query);
}

function viwAllDepartments() {
    var query = "SELECT * FROM department"

    executeQueryNoResult(query)
}

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, roles) {
        if (err) {
            throw err;
        }
        const roleChoices = roles.map(r => {
            return {
                name: r.title,
                value: r.id
            }
        })
        connection.query("SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title, role.id AS role_id FROM employee LEFT JOIN role on employee.role_id = role.id WHERE role.title = \"Manager\"", function (errTwo, managers) {
            if (errTwo) {
                throw errTwo;
            }
            const managerChoices = managers.map(m => {
                return {
                    name: m.first_name,
                    value: m.employee_id
                }
            })

            managerChoices.push({
                name: "None",
                value: null
            });
            inquirer
                .prompt([{
                        name: "first_name",
                        type: "input",
                        message: "What is the employees first name?"
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "What is the employees last name?"

                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is the role of the employee?",
                        choices: roleChoices
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the employee manager?",
                        choices: managerChoices
                    }
                ]).then((answer) => {
                    connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("${answer.first_name}", "${answer.last_name}", ${answer.role}, ${answer.manager})`, function (err, res) {
                        if (err) {
                            throw err
                        }
                        runSearch();
                    })
                })
        })
    })
}

function addRole() {
    connection.query("SELECT * FROM department", function (err, department) {
        if (err) {
            throw err;
        }
        const departmentChoices = department.map(d => {
            return {
                name: d.department_name,
                value: d.id
            }
        })
        inquirer
            .prompt([{
                    name: "role",
                    type: "input",
                    message: "What is the role?",
                },
                {
                    name: "department",
                    type: "list",
                    message: "Add to the department!",
                    choices: departmentChoices
                },
                {
                    name: "salary",
                    type: "number",
                    message: "What is the salary?",
                }
            ]).then((answer) => {
                connection.query(`INSERT INTO role (title, department_id, salary) VALUES ("${answer.role}", "${answer.department}", "${answer.salary}")`, function (err, res) {
                    if (err) {
                        throw err
                    }
                    runSearch();
                });
            });
    });
}

function addDepartment() {
    inquirer
        .prompt([{
            name: "department",
            type: "input",
            message: "Add a new department.",
        }])
        .then((answer) => {
            connection.query(`INSERT INTO department (department_name) VALUES ("${answer.department}")`, function (err, res) {
                if (err) {
                    throw err;
                }
                runSearch();
            });
        });
}

function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", function (err, employee) {
        if (err) {
            throw err;
        }
        const allEmployees = employee.map(e => {
            return {
                name: `${e.first_name} ${e.last_name}`,
                value: e.id
            }
        });
        connection.query("SELECT title, id FROM role", function (err, role) {
            if (err) {
                throw err;
            }
            const updateChoices = role.map(r => {
                return {
                    name: r.title,
                    value: r.id
                }
            })
            inquirer
                .prompt([{
                        type: "list",
                        name: "employee",
                        message: "Which employee's role do you want to update?",
                        choices: allEmployees
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is the new role?",
                        choices: updateChoices
                    }
                ]).then((answer) => {
                    connection.query(`UPDATE employee SET role_id=${answer.role} Where id=${answer.employee}`, function(err, res){
                        if(err){
                            throw err;
                        }
                        runSearch();
                    });
                });
        });
    });
}