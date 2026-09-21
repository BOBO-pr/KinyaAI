import mongoose from 'mongoose';

export let isConnectedToMongo = false;

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kinyaai';

  try {
    console.log(`[DB] Connecting to MongoDB at ${mongoUri.split('@').pop()}...`);
    // Connect with a 3-second timeout so app doesn't hang if local mongod is not started
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnectedToMongo = true;
    console.log('[DB] MongoDB Connected Successfully ✅');
  } catch (error: any) {
    isConnectedToMongo = false;
    console.warn('[DB] MongoDB connection unavailable. Operating in resilient In-Memory persistence mode.');
    console.warn(`[DB] Notice: ${error.message}`);
  }
};

export default connectDB;
