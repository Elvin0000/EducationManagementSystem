CREATE DATABASE IF NOT EXISTS ems;
USE ems;

-- Table for Users
CREATE TABLE IF NOT EXISTS `users` (
    `username` varchar(50),
    `password` varchar(255) NOT NULL,
    `email` varchar(100) NOT NULL PRIMARY KEY,
    `dob` date,
    `phone_no` varchar(15),
    `student` int DEFAULT 0,
    `teacher` int DEFAULT 0,
    `admin` int DEFAULT 0
);

-- Table for Examinations
CREATE TABLE IF NOT EXISTS `examinations` (
    `ExamID` INT PRIMARY KEY,
    `ExamName` VARCHAR(255) NOT NULL,
    `ExamDate` DATE NOT NULL,
    `email` varchar(100) NOT NULL,
    FOREIGN KEY (`email`) REFERENCES `users`(`email`)
);

-- Table for Subjects
CREATE TABLE IF NOT EXISTS `subjects` (
    `SubjectID` INT PRIMARY KEY,
    `SubjectName` VARCHAR(255) NOT NULL,
    `Mark` INT NOT NULL,
    `ExamID` INT,
    FOREIGN KEY (`ExamID`) REFERENCES `examinations`(`ExamID`)
);

-- Inserting data for the user
INSERT INTO `users` (`username`, `password`, `email`, `dob`, `phone_no`, `student`, `teacher`, `admin`)
VALUES ('John Doe', 'abcdef', 'john@example.com', '1990-01-01', '0123456789', 1, 0, 0);

-- Inserting data for an examination
INSERT INTO `examinations` (`ExamID`, `ExamName`, `ExamDate`, `email`)
VALUES (1, 'Midterm', '2024-03-15', 'john@example.com');

-- Inserting data for subjects related to the examination
INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `Mark`, `ExamID`)
VALUES (1, 'Math', 90, 1);

INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `Mark`, `ExamID`)
VALUES (2, 'Science', 85, 1);

INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `Mark`, `ExamID`)
VALUES (3, 'History', 78, 1);

--Check examination
SELECT     e.ExamID,     e.ExamName,     e.ExamDate FROM     `examinations` e JOIN     `users` u ON e.email = u.email WHERE     u.email = 'john@example.com' LIMIT 0, 1000

--check marks and subject
`examinations` e ON s.ExamID = e.ExamID
JOIN
    `users` u ON e.email = u.email
WHERE
    u.email = 'john@example.com'
    AND e.ExamName = 'Midterm';