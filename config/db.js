const mongoose = require('mongoose');

const connectDB = async () => {
  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4 // Force IPv4
  };

  console.log('Connecting to MongoDB Atlas...');

  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('✅ MongoDB Connected Successfully!');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.log('🔧 Troubleshooting Tips:');
    console.log('1. Check your MongoDB URI in .env file');
    console.log('2. Ensure IP is whitelisted in MongoDB Atlas');
    console.log('3. Try using a mobile hotspot or alternate network');
    process.exit(1);
  }
};

module.exports = connectDB;
