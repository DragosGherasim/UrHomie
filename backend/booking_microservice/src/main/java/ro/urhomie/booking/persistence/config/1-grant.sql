CREATE DATABASE IF NOT EXISTS `booking-service`;

GRANT SELECT, INSERT, UPDATE, DELETE ON `booking-service`.* TO 'booking-service-manager'@'%';

FLUSH PRIVILEGES;