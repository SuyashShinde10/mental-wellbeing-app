const mongoose = require('mongoose');

// Vercel Serverless Cache Pattern
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI environment variable is missing.");
    // We do NOT process.exit(1) here in a serverless environment because it crashes the whole lambda.
    // Instead, we throw an error so the HTTP request fails gracefully with a 500.
    throw new Error('Database configuration missing. Please add MONGO_URI in Vercel environment variables.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch(err => {
      console.error(`Error connecting to MongoDB: ${err.message}`);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
};

module.exports = connectDB;