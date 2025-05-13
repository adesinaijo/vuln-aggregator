// db.js
require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  try {
    // Use the correct environment variable for your Atlas connection
    console.log("Attempting to connect with MONGODB_URI:", process.env.MONGO_CLOUD_URI); 
    await mongoose
      .connect(
        process.env.MONGO_CLOUD_URI // <--- Changed this line
            , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log("✅ Database connected successfully");
      });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Stop the server if the DB connection fails
  }
}

module.exports = connectDB;