const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please check your MongoDB Atlas IP whitelist and connection string');
    // Don't exit process - let server run without DB for debugging
    console.log('Server will continue running without database connection');
  }
};

module.exports = connectDB;
