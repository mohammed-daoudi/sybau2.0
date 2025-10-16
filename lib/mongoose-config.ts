import mongoose from 'mongoose';

const MONGODB_OPTIONS = {
  bufferCommands: false,
  autoCreate: true,
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000, // Increased from 5000
  socketTimeoutMS: 45000,
  family: 4,
  connectTimeoutMS: 15000, // Added explicit connect timeout
  keepAlive: true, // Keep connections alive
};

export function createMongooseConnection() {
  mongoose.set('strictQuery', true);
  
  // Event listeners for better error handling
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });

  return mongoose;
}