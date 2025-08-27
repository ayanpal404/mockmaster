require('dotenv').config();
const express = require('express'); // use for create API
const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');

const app = express();

// DB
connectDB();
console.log('DB connected');

// Middleware
app.use(helmet()); // secure headers
app.use(morgan('dev')); // log requests
app.use(express.json({ limit: '1mb' })); // parse JSON bodies
app.use(cookieParser()); // parse cookies

// CORS (allow frontend to send/receive cookies)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
);

// Health
app.get('/', (req, res) => res.send('MockMaster API ✅'));

// Routes
app.use('/api/auth', authRoutes);

// Error handler (keep last)
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
