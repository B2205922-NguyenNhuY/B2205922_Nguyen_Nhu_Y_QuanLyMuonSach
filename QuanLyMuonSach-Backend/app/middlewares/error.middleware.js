// middlewares/error.middleware.js
const ApiError = require("../api-error"); // import class ApiError nếu bạn dùng

// Middleware bắt lỗi 404 - route không tồn tại
const notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, "Resource not found"));
};

// Middleware xử lý lỗi chung
const errorHandlerMiddleware = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = {
  notFoundMiddleware,
  errorHandlerMiddleware,
};
