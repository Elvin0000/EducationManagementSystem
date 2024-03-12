const express = require('express');
// const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3002;

// // Use the CORS middleware
// app.use(cors());

app.use(express.json()); // Middleware to parse JSON request bodies

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'ems',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Use the pool to execute queries
app.get('/users', async (req, res) => {
  try {
    const [rows, fields] = await pool.execute('SELECT username, password, email, DATE_FORMAT(dob, "%Y-%m-%d") AS dob, phone_no, student, teacher, admin FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Both email and password are required.' });
    }

    // Query the database to check if the user exists and the password is correct
    const [rows, fields] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    // Check if the user was found
    if (rows.length > 0) {
      // Authentication successful
      res.status(200).json({ success: true, message: 'Login successful', user: rows[0] });
    } else {
      // Authentication failed
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/viewProfile', async (req, res) => {
  try {
    const { email } = req.query; // Use req.query to get parameters from the query string

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: 'Invalid request. Missing email parameter.' });
    }

    // Your SQL query to fetch user profile information
    const query = `
      SELECT
        username,
        dob,
        phone_no,
        student,
        teacher,
        admin
      FROM
        users
      WHERE
        email = ?;
    `;

    // Log the received email and the raw SQL query for debugging purposes
    console.log('Received email:', email);
    console.log('Executing query:', query);

    // Execute the query
    const [rows, fields] = await pool.execute(query, [email]);

    // Log the query result for debugging purposes
    console.log('Query result:', rows);

    // Check if the user with the provided email exists
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Extract user profile data
    const userProfile = {
      username: rows[0].username,
      dob: rows[0].dob,
      phone_no: rows[0].phone_no,
      student: rows[0].student,
      teacher: rows[0].teacher,
      admin: rows[0].admin,
    };

    // Send the user profile data as a response
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error viewing user profile:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.post('/saveProfile', async (req, res) => {
  try {
    const { email, username, dob, phone_no } = req.body;

    // Check if required parameters are provided
    if (!email || !username || !dob || !phone_no) {
      return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
    }

    // Your SQL query to update user profile information
    const query = `
      UPDATE users
      SET
        username = ?,
        dob = ?,
        phone_no = ?
      WHERE
        email = ?;
    `;

    // Log the received data and the raw SQL query for debugging purposes
    console.log('Received data:', req.body);
    console.log('Executing query:', query);

    // Execute the query
    const [result] = await pool.execute(query, [username, dob, phone_no, email]);

    // Log the query result for debugging purposes
    console.log('Query result:', result);

    // Check if the profile was successfully updated
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Profile updated successfully.' });
    } else {
      res.status(404).json({ error: 'User not found or no changes were made.' });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// const query = `
//   SELECT      
//     username, 
//     dob,      
//     phone_no, 
//     student,  
//     teacher,  
//     admin     
//   FROM        
//     users     
//   WHERE       
//     email = ?;
// `;

app.delete('/deleteProfile', async (req, res) => {
  try {
    const { email } = req.query;
    const query = `
      SELECT      
        username, 
        dob,      
        phone_no, 
        student,  
        teacher,  
        admin     
      FROM        
        users     
      WHERE       
        email = ?;
    `;
    console.log('Received email for deletion:', email);

    const [rows, fields] = await pool.execute(query, [email]);

    // Check if the user with the provided email exists
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Delete from Marks
    await pool.query('DELETE FROM `marks` WHERE `email` = ?', [email]);

    // Delete from Subjects (This will also delete associated marks)
    await pool.query('DELETE FROM `subjects` WHERE `ExamID` IN (SELECT `ExamID` FROM `examinations` WHERE `email` = ?)', [email]);

    // Delete from Examinations (This will also delete associated subjects and marks)
    await pool.query('DELETE FROM `examinations` WHERE `email` = ?', [email]);

    // Delete from Users (This will also delete associated examinations, subjects, and marks)
    await pool.query('DELETE FROM `users` WHERE `email` = ?', [email]);

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});











app.post('/addResult', async (req, res) => {
  try {
    const { email, examName, examDate, examID, tableData } = req.body;

    try {
      // Insert into 'examinations' table
      const [examResult] = await pool.execute(
        'INSERT INTO `examinations` (`ExamID`, `ExamName`, `ExamDate`, `email`) VALUES (?, ?, ?, ?)',
        [examID, examName, examDate, email]
      );

      // Insert into 'subjects' and 'marks' tables
      for (const rowData of tableData.slice(1)) {
        await pool.execute(
          'INSERT INTO `subjects` (`SubjectID`, `SubjectName`, `ExamID`) VALUES (?, ?, ?)',
          [rowData[0], rowData[1], examID]
        );

        await pool.execute(
          'INSERT INTO `marks` (`SubjectID`, `Mark`, `ExamID`, `email`) VALUES (?, ?, ?, ?)',
          [rowData[0], rowData[2], examID, email]
        );
      }

      res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
      // Rollback the transaction in case of an error
      console.error('Error adding data to the database:', error);
      res.status(500).json({ error: 'Error adding data to the database' });
    }
  } catch (error) {
    console.error('Error starting transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to retrieve exam names for a specific student
app.get('/studentsExam', async (req, res) => {
  try {
    const { email } = req.query;
    const [rows, fields] = await pool.execute(
      'SELECT ExamID, ExamName, ExamDate FROM examinations WHERE email = ?',
      [email]
    );

    const examsData = rows.map((row) => ({
      ExamID: row.ExamID,
      ExamName: row.ExamName,
      ExamDate: row.ExamDate,
    }));
    
    res.status(200).json(examsData);
  } catch (error) {
    console.error('Error fetching exams data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to delete an exam and associated subjects and marks
app.delete('/deleteExam', async (req, res) => {
  try {
    const { examId } = req.query;

    // Validate examId
    if (!examId) {
      return res.status(400).json({ message: 'Missing examId parameter in the request' });
    }

    // Delete marks associated with the exam
    await pool.execute('DELETE FROM marks WHERE ExamID = ?', [examId]);

    // Delete subjects associated with the exam
    await pool.execute('DELETE FROM subjects WHERE ExamID = ?', [examId]);

    // Delete the exam
    await pool.execute('DELETE FROM examinations WHERE ExamID = ?', [examId]);

    res.status(200).json({ message: 'Exam, associated subjects, and marks deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam, subjects, and marks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});






app.get('/studentsEmail', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const query = `
      SELECT DISTINCT u.email
      FROM users u
      LEFT JOIN examinations e ON u.email = e.email
      WHERE u.student = 1 AND (u.email LIKE ? OR e.ExamName LIKE ?)
    `;

    console.log('Executing query:', query);

    const [rows, fields] = await pool.execute(query, [`%${searchTerm}%`, `%${searchTerm}%`]);

    console.log('Fetched student emails:', rows);

    const studentEmails = rows.map((row) => row.email);
    res.status(200).json(studentEmails);
  } catch (error) {
    console.error('Error fetching student emails:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/studentsExam/Result', async (req, res) => {
  try {
    const { email, examId } = req.query;

    // Check if email and examId are defined before proceeding
    if (!email || !examId) {
      return res.status(400).json({ message: 'Invalid request. Missing parameters.' });
    }

    const query = `
      SELECT
        e.ExamName,
        e.ExamDate,
        s.SubjectID,
        s.SubjectName,
        m.Mark
      FROM
        subjects s
      LEFT JOIN
        marks m ON s.SubjectID = m.SubjectID AND s.ExamID = m.ExamID AND m.email = ?
      JOIN
        examinations e ON s.ExamID = e.ExamID
      JOIN
        users u ON e.email = u.email
      WHERE
        u.email = ?
        AND e.ExamID = ?;
    `;

    // Log the raw SQL query for debugging purposes
    console.log('Executing query:', query);

    const [rows, fields] = await pool.execute(query, [email, email, examId]);

    const examResults = rows.map((row) => ({
      ExamName: row.ExamName,
      ExamDate: row.ExamDate,
      SubjectID: row.SubjectID,
      SubjectName: row.SubjectName,
      Mark: row.Mark !== null ? row.Mark : 'N/A', // Use 'N/A' if the mark is null
    }));

    res.status(200).json(examResults);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.post('/studentsExam/UpdateResult', async (req, res) => {
  try {
    // Ensure that the required parameters are provided
    const { email, examId, updatedResults } = req.body;

    console.log('Received update request:', {
      email,
      examId,
      updatedResults,
    });

    if (!email || !examId || !updatedResults) {
      console.error('Invalid request. Missing parameters.');
      return res.status(400).json({ message: 'Invalid request. Missing parameters.' });
    }

    // Your logic to check permission goes here if needed

    // Iterate through updatedResults and update marks in the database
    for (const result of updatedResults) {
      const { SubjectID, Mark } = result;

      // Update the mark in the database
      const updateQuery = `
        UPDATE marks
        SET Mark = ?
        WHERE email = ? AND ExamID = ? AND SubjectID = ?;
      `;

      await pool.execute(updateQuery, [Mark, email, examId, SubjectID]);
    }

    console.log('Exam results updated successfully.');
    res.status(200).json({ message: 'Exam results updated successfully.' });
  } catch (error) {
    console.error('Error updating exam results:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Define a basic route
app.get('/', (req, res) => {
  res.send('Hello, this is your Node.js server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
