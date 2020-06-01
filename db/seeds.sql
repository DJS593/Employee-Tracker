


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
  ('Sales Analyst', 75000, 1, 1),
  ('Sales Manager', 125000, 2, 1),
  ('Sales Director', 175000, 3, 1),
  ('Finance Analyst', 75000, 4, 2),
  ('Finance Manager', 125000, 5, 2),
  ('Finance Director', 175000, 6, 2),
  ('Marketing Analyst', 75000, 7, 3),
  ('Marketing Manager', 125000, 8, 3),
  ('Marketing Director', 175000, 9, 3),
  ('Technology Analyst', 75000, 10, 4),
  ('Technology Manager', 125000, 11, 4),
  ('Technology Director', 175000, 12, 4),
  ('Operations Analyst', 75000, 13, 5),
  ('Operations Manager', 125000, 14, 5),
  ('Operations Director', 175000, 15, 5),
  ('Risk Analyst', 75000, 16, 6),
  ('Risk Manager', 125000, 17, 6),
  ('Risk Director', 175000, 18, 6);
  

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
  ('Tom', 'Smith', 1, 1),
  ('Susan', 'Jones', 2, 2),
  ('Bob', 'Knight', 3, 3),
  ('Terry', 'White', 4, 4),
  ('Matt', 'Matsui', 5, 5),
  ('Chris', 'Christo', 6, 6),
  ('Bob', 'Smith', 7, 7),
  ('Kathy', 'Brown', 8, 8),
  ('Matt', 'Young', 9, 9),
  ('Walter', 'Sato', 10, 10),
  ('Willy', 'Wonka', 11, 11),
  ('Buster', 'Posey', 12, 12),
  ('Madison', 'Bumgarner', 13, 13),
  ('Chipper', 'Jones', 14, 14),
  ('Steve', 'Avery', 15, 15),
  ('Hulk', 'Hogan', 16, 16),
  ('Barry', 'Sanders', 17, 17),
  ('Jerry', 'Rice', 18, 18);