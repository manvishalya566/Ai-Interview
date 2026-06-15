import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI in .env.local"
  );
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {

    cached.conn = await cached.promise;

  } catch (error) {

    cached.promise = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
}