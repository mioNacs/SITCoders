import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from './models/resource.model.js';
import connectDB from './db/index.js';

dotenv.config();

async function migrate() {
  try {
    await connectDB();
    console.log("Database connected. Starting upvotes migration...");

    // Use updateMany to find documents where 'upvotes' is a number
    const result = await Resource.updateMany(
      { upvotes: { $type: "number" } },
      { $set: { upvotes: [] } }
    );

    console.log(`Migration complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();