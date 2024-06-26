CREATE DATABASE IF NOT EXISTS ems;
USE ems;
DROP TABLE IF EXISTS `answers`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `announcement`;
DROP TABLE IF EXISTS `marks`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `examinations`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE IF NOT EXISTS `users` (
    `username` varchar(50),
    `password` varchar(255) NOT NULL,
    `email` varchar(100) NOT NULL PRIMARY KEY,
    `avatar` varchar(100),
    `dob` date,
    `phone_no` varchar(15),
    `student` int DEFAULT 0,
    `teacher` int DEFAULT 0,
    `parent` int DEFAULT 0,
    `admin` int DEFAULT 0,
    `selectedRole` varchar(10) DEFAULT NULL
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

CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    asked_by VARCHAR(255) NOT NULL,
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    answer_text TEXT NOT NULL,
    answered_by VARCHAR(255) NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    question_id INT,
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE announcement (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    announcement_text TEXT NOT NULL,
    announced_by VARCHAR(255) NOT NULL,
    announced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserting sample questions
INSERT INTO questions (question_text, asked_by) VALUES 
('What is the capital of France?', 'test1@example.com'),
('What is the largest mammal on Earth?', 'test2@example.com'),
('How does photosynthesis work?', 'test1@example.com'),
('What is the capital of Japan?', 'test2@example.com'),
('Who is the author of "Romeo and Juliet"?', 'test1@example.com'),
('What is the chemical symbol for water?', 'test2@example.com'),
('What is the boiling point of water in Celsius?', 'test1@example.com'),
('Who discovered the theory of relativity?', 'test2@example.com');

INSERT INTO answers (answer_text, answered_by, question_id) VALUES
('The capital of France is Paris.', 'test1@example.com', 1),
('The largest mammal on Earth is the blue whale.', 'test2@example.com', 2),
('Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.', 'test1@example.com', 3),
('I dk', 'test2@example.com', 3);

INSERT INTO announcement (announcement_text, announced_by)
VALUES ('Reminder: The meeting scheduled for tomorrow has been postponed.', 'test1@example.com');

INSERT INTO announcement (announcement_text, announced_by)
VALUES ('Congratulations to the winners of the coding competition!', 'test1@example.com');

INSERT INTO announcement (announcement_text, announced_by)
VALUES ('Please be informed that the office will be closed on Friday for maintenance.', 'test1@example.com');

-- Inserting data for users
INSERT INTO `users` (`username`, `password`, `email`, `dob`, `phone_no`, `student`, `teacher`,`parent`, `admin`,`selectedRole`,`avatar`)
VALUES ('John Doe', 'abcdef', 'john@example.com', '1990-01-01', '0123456789', 1, 0, 0, 0,'',17);

INSERT INTO `users` (`username`, `password`, `email`, `dob`, `phone_no`, `student`, `teacher`, `parent`, `admin`,`selectedRole`,`avatar`)
VALUES ('Test1', 'test', 'test1@example.com', '1990-01-01', '0123456789', 0, 1, 0, 0,'',17);

INSERT INTO `users` (`username`, `password`, `email`, `dob`, `phone_no`, `student`, `teacher`,`parent`, `admin`,`selectedRole`,`avatar`)
VALUES ('Test2', 'test', 'test2@example.com', '1990-01-01', '0123456789', 0, 0, 0, 1,'',17);

-- Inserting data for examinations
INSERT INTO `examinations` (`ExamID`, `ExamName`, `ExamDate`, `email`)
VALUES (1, 'Midterm', '2024-03-15', 'john@example.com');

-- Inserting data for subjects
INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `ExamID`)
VALUES (1001, 'Math Score', 1);

INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `ExamID`)
VALUES (1002, 'Writing Score', 1);

INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `ExamID`)
VALUES (1003, 'Reading Score', 1);

-- Inserting data for marks
INSERT INTO `marks` (`SubjectID`, `Mark`, `ExamID`, `email`)
VALUES (1001, 90, 1, 'john@example.com');

INSERT INTO `marks` (`SubjectID`, `Mark`, `ExamID`, `email`)
VALUES (1002, 85, 1, 'john@example.com');

INSERT INTO `marks` (`SubjectID`, `Mark`, `ExamID`, `email`)
VALUES (1003, 78, 1, 'john@example.com');

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
