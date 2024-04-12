const express = require('express');

const mysql = require('mysql2/promise');

const app = express();
const port = 3002;

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

// Check if email exists in the database
const checkEmailExists = async (email) => {
  const [rows, fields] = await pool.execute(
    'SELECT COUNT(*) AS count FROM users WHERE email = ?',
    [email]
  );
  return rows[0].count > 0;
};

const checkExamIDExists = async (examID) => {
  try {
    // Query the database to check if the exam ID exists
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS count FROM `examinations` WHERE `ExamID` = ?',
      [examID]
    );
    const count = rows[0].count;
    return count > 0;
  } catch (error) {
    console.error('Error checking exam ID existence:', error);
    throw error;
  }
};

// Add user to the database
const addUser = async (email, password, selectedRole) => {
  const [result, fields] = await pool.execute(
    'INSERT INTO users (email, password, selectedRole) VALUES (?, ?, ?)',
    [email, password, selectedRole]
  );
  return result.insertId; // Return the ID of the newly inserted user
};

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

app.get('/userDetails', async (req, res) => {
  try {
    const userEmail = req.query.email;

    // Query the database to fetch user details
    const [userDataRows, userDataFields] = await pool.execute(
      'SELECT email, student, teacher, admin, selectedRole FROM users WHERE email = ?',
      [userEmail]
    );

    // Check if user details were found
    if (userDataRows.length > 0) {
      // Extract user authentication details
      const userDetails = {
        email: userDataRows[0].email,
        student: userDataRows[0].student,
        teacher: userDataRows[0].teacher,
        admin: userDataRows[0].admin,
        selectedRole: userDataRows[0].selectedRole
      };

      // Send user details in the response
      res.status(200).json({ success: true, userDetails });
    } else {
      // User details not found
      res.status(404).json({ success: false, message: 'User details not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// API endpoint to handle user signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password, selectedRole } = req.body;

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    // Add user to the database
    const userId = await addUser(email, password, selectedRole);

    // Return success response
    res.status(201).json({ success: true, message: 'User created successfully', userId });
  } catch (error) {
    console.error('Error during signup:', error);
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

app.post('/updateProfile', async (req, res) => {
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

    // Check if the email exists
    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
      return res.status(400).json({ success: false, message: 'Email does not exist.' });
    }

    // Check if the exam ID exists
    const examIDExists = await checkExamIDExists(examID);
    if (examIDExists) {
      return res.status(400).json({ success: false, message: 'Exam ID already exists.' });
    }

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

// Endpoint to retrieve student emails with optional search term
app.get('/studentsEmailList', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const query = `
      SELECT DISTINCT e.email
      FROM examinations e
      WHERE e.email LIKE ?`;

    console.log('Executing query:', query);

    const [rows, fields] = await pool.execute(query, [`%${searchTerm}%`]);

    console.log('Fetched student emails:', rows);

    const studentEmails = rows.map((row) => row.email);
    res.status(200).json(studentEmails);
  } catch (error) {
    console.error('Error fetching student emails:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to retrieve exam names for a specific student with optional search term
app.get('/studentsExamList', async (req, res) => {
  try {
    const { email, searchTerm } = req.query;
    let query = 'SELECT ExamID, ExamName, ExamDate FROM examinations WHERE email = ?';
    const params = [email];

    if (searchTerm) {
      query += ' AND ExamName LIKE ?';
      params.push(`%${searchTerm}%`);
    }

    const [rows, fields] = await pool.execute(query, params);

    if (rows && rows.length > 0) {
      const examsData = rows.map((row) => ({
        ExamID: row.ExamID,
        ExamName: row.ExamName,
        ExamDate: row.ExamDate,
      }));

      res.status(200).json(examsData);
    } else {
      res.status(404).json({ message: 'No exams found for the specified student' });
    }
  } catch (error) {
    console.error('Error fetching exams data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/studentsExam/detailResult', async (req, res) => {
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

// Endpoint to delete an exam and associated subjects and marks
app.delete('/studentsExam/deleteResult', async (req, res) => {
  const { examId } = req.query;

  try {
    // Start a transaction
    await pool.query('START TRANSACTION');

    // Delete marks associated with the exam
    await pool.query('DELETE FROM marks WHERE SubjectID IN (SELECT SubjectID FROM subjects WHERE ExamID = ?)', [examId]);

    // Delete subjects associated with the exam
    await pool.query('DELETE FROM subjects WHERE ExamID = ?', [examId]);

    // Delete the exam
    await pool.query('DELETE FROM examinations WHERE ExamID = ?', [examId]);

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Exam, associated subjects, and marks deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam, subjects, and marks:', error);
    
    // Rollback the transaction on error
    await pool.query('ROLLBACK');

    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/studentsExam/updateResult', async (req, res) => {
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

// Endpoint to get all questions
app.get('/questions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM questions');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to post a new question
app.post('/questions', async (req, res) => {
  const { question_text, asked_by } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO questions (question_text, asked_by) VALUES (?, ?)', [question_text, asked_by]);
    res.status(201).json({ success: true, message: 'Question asked successfully', question_id: result.insertId });
  } catch (error) {
    console.error('Error asking question:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to get a single question by ID
app.get('/questions/:question_id', async (req, res) => {
  const { question_id } = req.params;
  try {
    const query = 'SELECT * FROM questions WHERE question_id = ?';
    const [rows] = await pool.execute(query, [question_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to get answers for a specific question
app.get('/questions/:question_id/answers', async (req, res) => {
  const { question_id } = req.params;
  try {
    const query = 'SELECT * FROM answers WHERE question_id = ?';
    const [rows] = await pool.execute(query, [question_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to post a new answer for a specific question
app.post('/questions/:question_id/answers', async (req, res) => {
  const { question_id } = req.params;
  const { answer_text, answered_by } = req.body;
  try {
    const query = 'INSERT INTO answers (answer_text, answered_by, question_id) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [answer_text, answered_by, question_id]);
    res.status(201).json({ success: true, message: 'Answer posted successfully', answer_id: result.insertId });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to get all student emails
app.get('/approveStudents', async (req, res) => {
  try {
    // Query to select emails of students
    const query = 'SELECT email FROM users WHERE selectedRole = "student"';
    // Execute the query
    const [rows] = await pool.query(query);
    // Extract emails from the query result
    const studentEmails = rows.map(row => row.email);
    // Send the emails as response
    res.status(200).json(studentEmails);
  } catch (error) {
    console.error('Error fetching student emails:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/users/:email/approveStudent', async (req, res) => {
  const email = req.params.email;
  console.log('Received request to approve user with email:', email);

  try {
    // Execute the database query
    await pool.query('UPDATE users SET student = ?, selectedRole = ? WHERE email = ?', [1, null, email]);

    // This code will run after the query is completed successfully
    console.log('User role updated successfully.');
    
    // Send response indicating successful approval
    res.status(200).json({ success: true, message: 'User has been approved as a student' });
  } catch (error) {
    // Handle any errors that occur during the query execution
    console.error('Error updating user role:', error);

    // Send response indicating failure due to internal server error
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// API endpoint to reject a student
app.put('/users/:email/rejectStudent', async (req, res) => {
  const email = req.params.email;
  console.log('Received request to reject user with email:', email);

  try {
    // Update the user's selectedRole to null
    await pool.query('UPDATE users SET selectedRole = ? WHERE email = ?', [null, email]);

    console.log('User with email', email, 'has been rejected.');

    res.status(200).json({ success: true, message: 'User has been rejected' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to get all teacher emails
app.get('/approveTeachers', async (req, res) => {
  try {
    // Query to select emails of teachers
    const query = 'SELECT email FROM users WHERE selectedRole = "teacher"';
    // Execute the query
    const [rows] = await pool.query(query);
    // Extract emails from the query result
    const teacherEmails = rows.map(row => row.email);
    // Send the emails as response
    res.status(200).json(teacherEmails);
  } catch (error) {
    console.error('Error fetching teacher emails:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/users/:email/approveTeacher', async (req, res) => {
  const email = req.params.email;
  console.log('Received request to approve user with email:', email);

  try {
    // Execute the database query
    await pool.query('UPDATE users SET teacher = ?, selectedRole = ? WHERE email = ?', [1, null, email]);

    // This code will run after the query is completed successfully
    console.log('User role updated successfully.');
    
    // Send response indicating successful approval
    res.status(200).json({ success: true, message: 'User has been approved as a teacher' });
  } catch (error) {
    // Handle any errors that occur during the query execution
    console.error('Error updating user role:', error);

    // Send response indicating failure due to internal server error
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// API endpoint to reject a teacher
app.put('/users/:email/rejectTeacher', async (req, res) => {
  const email = req.params.email;
  console.log('Received request to reject user with email:', email);

  try {
    // Update the user's selectedRole to null
    await pool.query('UPDATE users SET selectedRole = ? WHERE email = ?', [null, email]);

    console.log('User with email', email, 'has been rejected.');

    res.status(200).json({ success: true, message: 'User has been rejected' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to get all announcements
app.get('/announcements', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM announcement');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/announcements', async (req, res) => {
  const { announcement_text, announced_by } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO announcement (announcement_text, announced_by) VALUES (?, ?)', [announcement_text, announced_by]);
    res.status(201).json({ success: true, message: 'Announcement posted successfully', announcement_id: result.insertId });
  } catch (error) {
    console.error('Error posting announcement:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to update an announcement
app.put('/announcements/:announcementId', async (req, res) => {
  const { announcement_text } = req.body;
  const { announcementId } = req.params;
  try {
    const [result] = await pool.query('UPDATE announcement SET announcement_text = ? WHERE announcement_id = ?', [announcement_text, announcementId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement updated successfully' });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Endpoint to delete an announcement
app.delete('/announcements/:announcementId', async (req, res) => {
  const { announcementId } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM announcement WHERE announcement_id = ?', [announcementId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
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
