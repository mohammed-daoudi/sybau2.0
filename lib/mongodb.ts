import mongoose from 'mongoose';
import { mockDb } from './mock-db';

// Check if we should use mock database for development
const USE_MOCK_DB = !process.env.MONGODB_URI || process.env.NODE_ENV === 'development';

if (!USE_MOCK_DB && !process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI || '';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobal: GlobalMongoose;
}

let cached = global.mongooseGlobal;

if (!cached) {
  cached = global.mongooseGlobal = {
    conn: null,
    promise: null
  };
}

async function connect(): Promise<typeof mongoose> {
  // Use mock database in development when MongoDB is not available
  if (USE_MOCK_DB) {
    await mockDb.connect();
    return mongoose;
  }

  if (cached?.conn) {
    return cached.conn;
  }

  const options: mongoose.ConnectOptions = {
    heartbeatFrequencyMS: 2000,
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
  };

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, options);
    }
    
    const client = await cached.promise;
    cached.conn = client;

    // Set up event handlers
    client.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cached.conn = null;
      cached.promise = null;
    });

    client.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      cached.conn = null;
      cached.promise = null;
    });

    client.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

async function disconnect(): Promise<void> {
  if (USE_MOCK_DB) {
    await mockDb.disconnect();
    return;
  }

  if (cached?.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export const connectDB = connect;
export const disconnectDB = disconnect;