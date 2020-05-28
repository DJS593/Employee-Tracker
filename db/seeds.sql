


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
  

INSERT INTO employee (first_name, last_name, id, role_id, manager_id)
VALUES  
  ('Tom', 'Smith', 50, 1, 51),
  ('Susan', 'Jones', 51, 2, 52),
  ('Bob', 'Knight', 52, 3, null),
  ('Terry', 'White', 53, 4, 54),
  ('Matt', 'Matsui', 54, 5, 55),
  ('Chris', 'Christo', 55, 6, null),
  ('Bob', 'Smith', 56, 7, 57),
  ('Kathy', 'Brown', 57, 8, 58),
  ('Matt', 'Young', 58, 9, null),
  ('Walter', 'Sato', 59, 10, 60),
  ('Willy', 'Wonka', 60, 11, 61),
  ('Buster', 'Posey', 61, 12, null),
  ('Madison', 'Bumgarner', 62, 13, 63),
  ('Chipper', 'Jones', 63, 14, 64),
  ('Steve', 'Avery', 64, 15, null),
  ('Hulk', 'Hogan', 65, 16, 66),
  ('Barry', 'Sanders', 66, 17, 67),
  ('Jerry', 'Rice', 67, 18, null);