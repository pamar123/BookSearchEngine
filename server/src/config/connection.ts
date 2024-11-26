import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookSearch';

console.log('MongoDB Connection URI:', MONGODB_URI.replace(/\/\/[^@]+@/, '//<credentials>@'));

mongoose.set('debug', true);  // Enable debugging

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🌱 Successfully connected to MongoDB.');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB error:', err);
});

db.on('connected', () => {
  console.log('MongoDB connected successfully');
});

export default db;