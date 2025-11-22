const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();

// Kết nối MongoDB
connectDB(process.env.MONGO_URI);

// Middlewares
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.json({ message: "Welcome to borrow book application." });
});

// Import routes
app.use("/api/nhaxuatban", require("./routes/nhaxuatban"));
app.use("/api/sach", require("./routes/sach"));
app.use("/api/docgia", require("./routes/docgia"));
app.use("/api/muontra", require("./routes/muontra"));
app.use("/api/auth", require("./routes/auth"));

// Xuất app để server.js sử dụng
module.exports = app;
