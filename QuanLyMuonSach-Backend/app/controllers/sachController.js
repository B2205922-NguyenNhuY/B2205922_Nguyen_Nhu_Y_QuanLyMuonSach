const Sach = require('../models/sach.model');
const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const NhaXuatBan = require('../models/nhaxuatban.model');

exports.createSach = async (req, res) => {
  try {
    const { MaNXB } = req.body;

    // Kiểm tra NXB tồn tại
    const nxb = await NhaXuatBan.findOne({ MaNXB });
    if (!nxb) {
      return res.status(400).json({ error: `NXB với MaNXB "${MaNXB}" không tồn tại` });
    }

    // Tạo sách mới, lưu _id của NXB nếu schema dùng ref
    const newSach = new Sach({
      ...req.body,
      MaNXB: nxb._id // dùng ObjectId để populate
    });

    await newSach.save();

    // Trả về thông tin sách kèm NXB
    const sachWithNXB = await Sach.findById(newSach._id).populate('MaNXB');
    res.status(201).json(sachWithNXB);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.getAllSach = async (req, res) => {
  try {
    const sachs = await Sach.find().populate('MaNXB', 'TenNXB MaNXB');
    res.json(sachs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSachById = async (req, res) => {
  try {
    const sach = await Sach.findById(req.params.id).populate('MaSach');
    if (!sach) return res.status(404).json({ msg: 'Không tìm thấy sách' });
    res.json(sach);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSach = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Nếu cập nhật MaNXB, kiểm tra NXB tồn tại
    if (updateData.MaNXB) {
      const nxb = await NhaXuatBan.findOne({ MaNXB: updateData.MaNXB });
      if (!nxb) {
        return res.status(400).json({ error: `NXB với MaNXB "${updateData.MaNXB}" không tồn tại` });
      }
      updateData.MaNXB = nxb._id; // lưu _id để populate
    }

    // Cập nhật sách
    const updatedSach = await Sach.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedSach) {
      return res.status(404).json({ error: 'Không tìm thấy sách cần cập nhật' });
    }

    // Populate thông tin NXB
    const sachWithNXB = await Sach.findById(updatedSach._id).populate('MaNXB');

    res.json(sachWithNXB);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteSach = async (req, res) => {
  try {
    await Sach.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Đã xóa' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllSach = async (req, res) => {
  try {
    const result = await Sach.deleteMany({});
    res.json({ msg: `Đã xóa ${result.deletedCount} sách` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};