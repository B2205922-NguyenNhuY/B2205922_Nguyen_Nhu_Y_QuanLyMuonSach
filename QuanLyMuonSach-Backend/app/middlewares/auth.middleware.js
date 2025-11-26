const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ error: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], "SECRET_KEY_123");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token không hợp lệ" });
  }
};