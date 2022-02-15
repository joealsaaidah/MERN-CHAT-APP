const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Connected to MongoDB:${conn.connection.host}`.bold.yellow.underline
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.bold.red);
    process.exit();
  }
};

module.exports = connectToDB;
