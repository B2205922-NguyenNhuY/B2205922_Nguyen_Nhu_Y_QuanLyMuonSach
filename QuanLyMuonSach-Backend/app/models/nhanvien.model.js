const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const nhanVienSchema = new mongoose.Schema({
    MSNV: { type: String, required: true, unique: true },
    HoTenNV: { type: String, required: true },
    Password: { type: String, required: true },
    ChucVu: { type: String },
    DiaChi: { type: String },
    SoDienThoai: { type: String }
});

nhanVienSchema.pre("save", async function () {
  if (!this.isModified("Password")) return;
  this.Password = await bcrypt.hash(this.Password, 10);
});



module.exports = mongoose.model("NhanVien", nhanVienSchema);
