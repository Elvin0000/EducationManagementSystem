CREATE DATABASE IF NOT EXISTS ems;
USE ems;

CREATE TABLE IF NOT EXISTS `users`(
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
    `email` varchar(100) NOT NULL,
    PRIMARY KEY(`id`)
);

INSERT INTO users (id, username, password, email) 
VALUES (00000001, 'admin', 'admin', 'admin@gmail.com');
