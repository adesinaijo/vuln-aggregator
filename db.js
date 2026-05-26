require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  try {
    console.log("Attempting to connect with MONGODB_URI:", process.env.MONGO_CLOUD_URI);
    await mongoose.connect(process.env.MONGO_CLOUD_URI);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
