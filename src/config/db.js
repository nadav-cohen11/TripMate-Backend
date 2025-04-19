import mongoose from 'mongoose';
import dotenv from 'dotenv'
import logger from './logger.js'

dotenv.config({ path: '.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected")
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
