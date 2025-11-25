const mongoose = require("mongoose");
const NhaXuatBan = require('./nhaxuatban.model.js');

const sachSchema = new mongoose.Schema({
    MaSach: { type: String, required: true, unique: true },
    TenSach: String,
    DonGia: Number,
    SoQuyen: Number,
    NamXuatBan: Number,
    MaNXB: { type: mongoose.Schema.Types.ObjectId, ref: 'NhaXuatBan', required: true }, // <-- quan trọng
    TacGia: String
});

module.exports = mongoose.model("Sach", sachSchema);
