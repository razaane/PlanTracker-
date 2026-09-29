import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plantracker';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB connecté avec succès : ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`ℹ️ MongoDB local non détecté (${error.message}).`);
    console.log(`⚡ PlanTracker utilise le DataStore local persistant haute performance (JSON/Async).`);
    return false;
  }
};
