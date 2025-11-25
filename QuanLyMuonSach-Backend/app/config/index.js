require('dotenv').config();
const mongoose = require("mongoose");

const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        uri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quanlymuonsach"
    }
};

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri); // chỉ cần URI
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};


// Export cả config và connectDB
module.exports = { config, connectDB };
