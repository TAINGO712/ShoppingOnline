const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = 'mongodb+srv://' 
  + MyConstants.DB_USER + ':' 
  + MyConstants.DB_PASS + '@' 
  + MyConstants.DB_SERVER + '/' 
  + MyConstants.DB_DATABASE;

const connect = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(
        'Connected to ' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE
      );
    } catch (err) {
      retries++;
      console.error(`MongoDB connection error (attempt ${retries}/${maxRetries}):`, err.message);
      
      if (retries < maxRetries) {
        console.log(`Retrying in 3 seconds...`);
        setTimeout(connectWithRetry, 3000);
      } else {
        console.error('Failed to connect after ' + maxRetries + ' attempts');
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

module.exports = { connect };