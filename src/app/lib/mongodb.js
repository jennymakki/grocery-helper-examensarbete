import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Define the MONGODB_URI env var");

// Mongoose for app routes
let cachedMongoose = global.mongoose;

if (!cachedMongoose) {
  cachedMongoose = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cachedMongoose.conn) return cachedMongoose.conn;

  if (!cachedMongoose.promise) {
    cachedMongoose.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cachedMongoose.conn = await cachedMongoose.promise;
  return cachedMongoose.conn;
}

// MongoClient for NextAuth
let cachedClient;
let cachedClientPromise;

if (!global._mongoClientPromise) {
  cachedClient = new MongoClient(MONGODB_URI);
  global._mongoClientPromise = cachedClient.connect();
}
cachedClientPromise = global._mongoClientPromise;

export const clientPromise = cachedClientPromise;