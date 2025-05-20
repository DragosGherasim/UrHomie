CREATE DATABASE IF NOT EXISTS `user-management`;

GRANT SELECT, INSERT, UPDATE, DELETE ON `user-management`.* TO 'user-management-manager'@'%';

FLUSH PRIVILEGES;