require('dotenv').config();
const mongoose = require('mongoose');
console.log('Trying:', process.env.MONGODB_URI.replace(/:[^@]+@/, ':*****@'));
mongoose.connect(process.env.MONGODB_URI, {family:4})
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failure:', err);
    process.exit(1);
  });
