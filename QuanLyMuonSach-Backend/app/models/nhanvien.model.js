const mongoose = require("mongoose");

const nhanVienSchema = new mongoose.Schema({
    MSNV: { type: String, required: true, unique: true },
    HoTenNV: { type: String, required: true },
    Password: { type: String, required: true },
    ChucVu: { type: String },
    DiaChi: { type: String },
    SoDienThoai: { type: String }
});

module.exports = mongoose.model("NhanVien", nhanVienSchema);
