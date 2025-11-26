const NhanVien = require("../models/nhanvien.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../api-error"); // nếu bạn có middleware xử lý lỗi

exports.login = async (req, res, next) => {
  try {
    const { MSNV, Password } = req.body;

    if (!MSNV || !Password) {
      return next(new ApiError(400, "MSNV và mật khẩu bắt buộc"));
    }

    // Tìm nhân viên
    const nv = await NhanVien.findOne({ MSNV });
    if (!nv) return next(new ApiError(400, "MSNV không tồn tại"));

    // So sánh mật khẩu
    const match = await bcrypt.compare(Password, nv.Password);
    if (!match) return next(new ApiError(400, "Sai mật khẩu"));

    // Tạo token, sử dụng secret từ .env
    const token = jwt.sign(
      {
        MSNV: nv.MSNV,
        HoTenNV: nv.HoTenNV,
        ChucVu: nv.ChucVu,
      },
      process.env.JWT_SECRET || "SECRET_KEY_123",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      status: "success",
      message: "Đăng nhập thành công",
      token,
      data: {
        MSNV: nv.MSNV,
        HoTenNV: nv.HoTenNV,
        ChucVu: nv.ChucVu
      }
    });

  } catch (err) {
    next(err); // để middleware lỗi xử lý
  }
};
