import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

export const connectMongo = async () => {
  if (!mongoUri) {
    console.error('❌ Missing MongoDB configuration: MONGODB_URI not set');
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || undefined
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    return false;
  }
};

export const testConnection = async () => {
  console.log('🔍 Testing MongoDB connection...');
  const ok = await connectMongo();
  if (!ok) return false;
  try {
    // Simple ping using admin command
    await mongoose.connection.db.admin().ping();
    console.log('✅ MongoDB ping successful');
    return true;
  } catch (err) {
    console.error('❌ MongoDB ping failed:', err.message);
    return false;
  }
};