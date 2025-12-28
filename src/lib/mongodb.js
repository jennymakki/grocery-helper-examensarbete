import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Define the MONGODB_URI env var");

// ---------- MONGOOSE (App data) ----------
let cachedMongoose = global.mongoose;

if (!cachedMongoose) {
  cachedMongoose = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cachedMongoose.conn) return cachedMongoose.conn;

  if (!cachedMongoose.promise) {
    cachedMongoose.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cachedMongoose.conn = await cachedMongoose.promise;
  return cachedMongoose.conn;
}

// ---------- MONGODB CLIENT (NextAuth) ----------
let cachedClientPromise;

if (!global._mongoClientPromise) {
  const client = new MongoClient(MONGODB_URI);
  global._mongoClientPromise = client.connect();
}

cachedClientPromise = global._mongoClientPromise;

export const clientPromise = cachedClientPromise;