INSERT INTO department(name) VALUES("Sales");
INSERT INTO department(name) VALUES("Legal");
INSERT INTO department(name) VALUES("Marketing");
INSERT INTO department(name) VALUES("Software");

INSERT INTO role(title, salary, department_id) VALUES("Manager", 100000, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("David", "Saiyan", 1, NULL);