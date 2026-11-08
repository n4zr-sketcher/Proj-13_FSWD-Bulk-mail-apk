import mongoose from 'mongoose';

/**
 * Connect to MongoDB using the URI from environment variables.
 * Logs success or non-fatal warning on connection failure so the server can start.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bulkmail';

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB connection error: ${error.message}`);
    console.error(`👉 Make sure MongoDB is running at: ${mongoUri}`);
  }
};

export default connectDB;
