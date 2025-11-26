const express = require('express');
const { notFoundMiddleware, errorHandlerMiddleware } = require("./app/middlewares/error.middleware");
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
app.use("/api/docgia", require("./app/routes/docgia"));
app.use("/api/muonsach", require("./app/routes/theodoimuonsach"));
app.use("/api/auth", require("./app/routes/auth"));

// Middleware 404
app.use(notFoundMiddleware);

// Middleware xử lý lỗi chung
app.use(errorHandlerMiddleware);


module.exports = app;
