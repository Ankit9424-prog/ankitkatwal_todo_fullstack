// Ankit Katwal
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo_fullstack_db";
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[Database Connection Alert] ${error.message}`);
    console.log("[Database] Server running with in-memory resilient fallback provider.");
  }
};

module.exports = connectDB;
