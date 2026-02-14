const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      console.error('Please check your .env file');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    
    // MongoDB Atlas connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Atlas connected successfully!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌍 Host: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Specific error messages for common issues
    if (error.message.includes('bad auth')) {
      console.error('\n🔐 Authentication failed. Please check:');
      console.error('   - Username and password are correct');
      console.error('   - Password is URL-encoded (special characters)');
    } else if (error.message.includes('getaddrinfo')) {
      console.error('\n🌐 Network error. Please check:');
      console.error('   - Your internet connection');
      console.error('   - MongoDB Atlas cluster is accessible');
      console.error('   - IP address is whitelisted in Atlas');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;