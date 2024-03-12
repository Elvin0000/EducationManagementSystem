CREATE DATABASE IF NOT EXISTS ems;
USE ems;

DROP TABLE IF EXISTS `marks`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `examinations`;
DROP TABLE IF EXISTS `users`;

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
    `SubjectID` INT,
    `SubjectName` VARCHAR(255) NOT NULL,
    `ExamID` INT,
    PRIMARY KEY (`SubjectID`, `ExamID`),
    FOREIGN KEY (`ExamID`) REFERENCES `examinations`(`ExamID`)
);

-- Table for Marks
CREATE TABLE IF NOT EXISTS `marks` (
    `SubjectID` INT,
    `Mark` INT NOT NULL,
    `ExamID` INT,
    `email` VARCHAR(100),
    PRIMARY KEY (`SubjectID`, `ExamID`, `email`),
    FOREIGN KEY (`ExamID`) REFERENCES `examinations`(`ExamID`),
    FOREIGN KEY (`email`) REFERENCES `users`(`email`),
    FOREIGN KEY (`SubjectID`) REFERENCES `subjects`(`SubjectID`)
);

-- Inserting data for users
INSERT INTO `users` (`username`, `password`, `email`, `dob`, `phone_no`, `student`, `teacher`, `admin`)
VALUES ('John Doe', 'abcdef', 'john@example.com', '1990-01-01', '0123456789', 1, 0, 0);

INSERT INTO `users` (`username`, `password`, `email`, `dob`, `phone_no`, `student`, `teacher`, `admin`)
VALUES ('Test1', 'test', 'test1@example.com', '1990-01-01', '0123456789', 1, 0, 0);

INSERT INTO `users` (`username`, `password`, `email`, `dob`, `phone_no`, `student`, `teacher`, `admin`)
VALUES ('Test2', 'test', 'test2@example.com', '1990-01-01', '0123456789', 1, 0, 0);

-- Inserting data for examinations
INSERT INTO `examinations` (`ExamID`, `ExamName`, `ExamDate`, `email`)
VALUES (1, 'Midterm', '2024-03-15', 'john@example.com');

INSERT INTO `examinations` (`ExamID`, `ExamName`, `ExamDate`, `email`)
VALUES (2, 'Midterm', '2024-03-15', 'test1@example.com');

INSERT INTO `examinations` (`ExamID`, `ExamName`, `ExamDate`, `email`)
VALUES (3, 'Midterm', '2024-03-15', 'test2@example.com');

-- Inserting data for subjects
INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `ExamID`)
VALUES (1, 'Math', 1);

INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `ExamID`)
VALUES (2, 'Science', 1);

INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `ExamID`)
VALUES (3, 'History', 1);

-- Inserting data for marks
INSERT INTO `marks` (`SubjectID`, `Mark`, `ExamID`, `email`)
VALUES (1, 90, 1, 'john@example.com');

INSERT INTO `marks` (`SubjectID`, `Mark`, `ExamID`, `email`)
VALUES (2, 85, 1, 'john@example.com');

INSERT INTO `marks` (`SubjectID`, `Mark`, `ExamID`, `email`)
VALUES (3, 78, 1, 'john@example.com');

-- Check Exam Name
SELECT DISTINCT e.`ExamName`
FROM `examinations` e
JOIN `marks` m ON e.`ExamID` = m.`ExamID`
JOIN `users` u ON m.`email` = u.`email`
WHERE u.`email` = 'john@example.com';

-- Check Exam Mark
SELECT s.`SubjectName`, m.`Mark`
FROM `marks` m
JOIN `examinations` e ON m.`ExamID` = e.`ExamID`
JOIN `subjects` s ON m.`SubjectID` = s.`SubjectID` AND e.`ExamID` = s.`ExamID`
JOIN `users` u ON m.`email` = u.`email`
WHERE u.`email` = 'john@example.com' AND e.`ExamName` = 'Midterm';
