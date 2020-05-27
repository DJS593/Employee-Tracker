


INSERT INTO department (name, id)
VALUES
  ('Sales', 1),
  ('Finance', 2),
  ('Marketing', 3),
  ('Technology', 4),
  ('Operations', 5),
  ('Risk', 6);


INSERT INTO role (title, salary, id, department_id)
VALUES
  ('Analyst', 75000, 1, 1),
  ('Manager', 125000, 2, 1),
  ('Director', 175000, 3, 1);


INSERT INTO employee (first_name, last_name, id, role_id)
VALUES  
  ('Tom', 'Smith', 50, 1),
  ('Susan', 'Jones', 51, 2),
  ('Bob', 'Knight', 52, 3),
  ('Terry', 'White', 53, 1),
  ('Matt', 'Matsui', 54, 2),
  ('Chris', 'Christo', 55, 3);