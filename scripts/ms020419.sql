CREATE DATABASE mears_poc;

CREATE USER 'mearspoc'@'localhost' IDENTIFIED BY 'mears';

GRANT ALL PRIVILEGES ON `mearspoc`.* TO 'mearspoc'@'localhost';

FLUSH PRIVILEGES;