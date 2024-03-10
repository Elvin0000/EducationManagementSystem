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
        s.SubjectName,
        m.Mark
      FROM
        subjects s
      JOIN
        marks m ON s.SubjectID = m.SubjectID AND s.ExamID = m.ExamID
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

    const [rows, fields] = await pool.execute(query, [email, examId]);

    const examResults = rows.map((row) => ({
      SubjectName: row.SubjectName,
      Mark: row.Mark,
    }));

    res.status(200).json(examResults);
  } catch (error) {
    console.error('Error fetching exam results:', error);
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
