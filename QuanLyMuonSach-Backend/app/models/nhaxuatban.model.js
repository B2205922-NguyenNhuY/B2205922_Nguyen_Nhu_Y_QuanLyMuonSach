const mongoose = require("mongoose");

const nxbSchema = new mongoose.Schema({
    MaNXB: { type: String, required: true, unique: true },
    TenNXB: { type: String, required: true },
    DiaChi: String
}, { 
  versionKey: false // loại bỏ __v khi xuất JSON (tùy chọn)
});

module.exports = mongoose.model("NhaXuatBan", nxbSchema);
