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

function getInfo(query) {

    connection.query(query, function (error, results) {
        if (error) throw error;
        console.table(results);
        // results.forEach(element => {
            //     console.log(element)
            // });
        });
        
}
    
    // getInfo("SELECT * FROM department");
    // getInfo("SELECT * FROM role");
    // getInfo("SELECT * FROM employee");
    

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

//  Connection function for all View Data requests 
function viewData(query){
    connection.query(query, function (err, res) {
        if (err){
            throw err
        } 
        console.table(res); 
        runSearch()
        return
    })
}

function viwAllEmployees() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    
    viewData(query)
}

function viwAllRoles() {
    var query = "SELECT * FROM role"
    
    viewData(query)
}

function viwAllDepartments() {
    var query = "SELECT * FROM department"

    viewData(query)
}

function addEmployee() {
    
}

function addRole() {}

function addDepartment() {}

function updateEmployeeRole() {

}
