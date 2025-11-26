const express = require('express');
const { connectDB, config } = require('./app/config');
const ApiError = require("./app/api-error");
const app = express();

// Middleware ví dụ
app.use(express.json());

// Routes ví dụ
app.get('/', (req, res) => {
  res.send('Hello, QuanLyMuonSach Backend!');
});
app.use("/api/nhaxuatban", require("./app/routes/nhaxuatban"));
app.use("/api/sach", require("./app/routes/sach"));
app.use("/api/nhanvien", require("./app/routes/nhanvien"));
//app.use("/api/docgia", require("./app/routes/docgia"));
//app.use("/api/muontra", require("./app/routes/muontra"));
//app.use("/api/auth", require("./app/routes/auth"));

// Middleware không tìm thấy route
app.use((req, res, next) => {
  next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});


module.exports = app;
