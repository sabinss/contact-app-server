const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoUri");

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log(`MongoDB connected`);
  } catch (err) {
    console.error(err.message ?? "MongoDB connection failed");

    //exit with failure
    process.exit(1);
  }
};

module.exports = connectDB;
