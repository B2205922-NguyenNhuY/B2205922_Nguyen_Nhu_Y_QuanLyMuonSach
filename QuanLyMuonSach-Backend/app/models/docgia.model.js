const mongoose = require('mongoose');

const docgiaSchema = new mongoose.Schema({
  MaDocGia: { type: String, required: true, unique: true }, // Mã độc giả
  HoLot: { type: String, required: true },                 // Họ lót
  Ten: { type: String, required: true },                   // Tên
  NgaySinh: { type: Date, required: true },               // Ngày sinh
  Phai: { type: String, enum: ['Nam', 'Nu'], required: true }, // Giới tính
  DiaChi: String,
  DienThoai: String
}, {
  versionKey: false // bỏ __v
});

module.exports = mongoose.model("DocGia", docgiaSchema);
