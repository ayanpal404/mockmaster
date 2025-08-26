require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json()); // For parsing JSON bodies

// Example Route
app.get('/', (req, res) => {
  res.send('Welcome to MockMaster..A big project');
});
app.get('/welcome', (req, res) => {
  res.send('Hello boss');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
