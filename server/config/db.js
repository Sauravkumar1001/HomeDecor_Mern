import mongoose from 'mongoose';

let cachedConnection = null;

export const connectDB = async () => {
  // If already connected, reuse connection (essential for Vercel serverless)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/homedecor';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    cachedConnection = conn;
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
    // Don't kill process in Vercel serverless environment
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

