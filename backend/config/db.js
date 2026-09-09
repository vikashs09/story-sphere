const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      config.mongoUri
    );

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

    console.log(
      `Database: ${connection.connection.name}`
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;