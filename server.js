const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Middleware to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection (Optional, in case you need it for storing users or violations)
mongoose.connect('mongodb://localhost:27017/exam_proctor', { useNewUrlParser: true, useUnifiedTopology: true });

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Temporary users for example purposes (you can fetch from database)
const users = [
  { username: 'test', password: 'password' }
];

// Login route to handle form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Successful login: Redirect to exam page
    res.redirect('/');
  } else {
    // Failed login: Redirect back to login with an error message
    res.send('<script>alert("Invalid credentials!"); window.location.href = "/";</script>');
  }
});

