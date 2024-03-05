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
// app.get('/users', async (req, res) => {
//   try {
//     const [rows, fields] = await pool.execute('SELECT * FROM users');
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

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

// Endpoint to retrieve exam data
app.get('/exams', async (req, res) => {
  try {
    // Assuming there is a table named 'examinations' with the necessary columns
    const [rows, fields] = await pool.execute(
      'SELECT email, examName, examDate FROM examinations'
    );

    // Organize data into the required structure for SectionList
    const examData = [];
    const emailSet = new Set();

    rows.forEach((row) => {
      const { email, examName, examDate } = row;
      // Check if the email is already in the set
      if (!emailSet.has(email)) {
        emailSet.add(email);
        // Add a new section with email as the title
        examData.push({ email, data: [{ examName, examDate }] });
      } else {
        // Find the section with the corresponding email and add the exam to its data
        const sectionIndex = examData.findIndex((section) => section.email === email);
        if (sectionIndex !== -1) {
          examData[sectionIndex].data.push({ examName, examDate });
        }
      }
    });

    res.status(200).json(examData);
  } catch (error) {
    console.error('Error fetching exam data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
