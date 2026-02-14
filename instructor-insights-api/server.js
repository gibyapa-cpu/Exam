// Load environment variables at the very beginning
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  console.error('Error loading .env file:', result.error);
  console.error('Please make sure you have created a .env file');
  process.exit(1);
}

// Log the MongoDB URI (masked for security)
const maskedUri = process.env.MONGODB_URI 
  ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':***@') 
  : 'NOT SET';
console.log('MONGODB_URI:', maskedUri);

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}/api/v1`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});