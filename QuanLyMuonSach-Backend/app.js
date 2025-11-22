const ApiError = require("./api-error");
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

app.use((req, res, next) => {
    // Code ở đây sẽ chạy khi không có route được định nghĩa nào
    // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
    return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong đoạn code xử lý ở các route, gọi next(error) sẽ chuyển về middleware xử lý lỗi này
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

// Xuất app để server.js sử dụng
module.exports = app;
