CREATE DATABASE IF NOT EXISTS DBPatternSilo;
DROP USER IF EXISTS 'PatternSilo'@'localhost';
CREATE USER 'PatternSilo'@'localhost' IDENTIFIED BY 'password';
GRANT CREATE, UPDATE, INSERT, INDEX, DROP, SELECT, DELETE ON db_password.* TO 'PatternSilo'@'localhost';
FLUSH PRIVILEGES;