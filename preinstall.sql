CREATE USER 'PatternSilo'@'localhost' IDENTIFIED BY 'password';
GRANT CREATE ON *.* TO 'PatternSilo'@'localhost';
GRANT UPDATE ON *.* TO 'PatternSilo'@'localhost';
GRANT INSERT ON *.* TO 'PatternSilo'@'localhost';
GRANT INDEX ON *.* TO 'PatternSilo'@'localhost';
GRANT DROP ON *.* TO 'PatternSilo'@'localhost';
GRANT SELECT ON *.* TO 'PatternSilo'@'localhost';
GRANT DELETE ON *.* TO 'PatternSilo'@'localhost';

FLUSH PRIVILEGES;