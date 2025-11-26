const TheoDoiMuonSach = require("../models/theodoimuonsach.model");
const Sach = require('../models/sach.model');
const DocGia = require("../models/docgia.model");

// Lấy tất cả
exports.getAll = async (req, res) => {
  try {
    const data = await TheoDoiMuonSach.find()
      .populate("MaDocGia")
      .populate("MaSach");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy theo ID
exports.getById = async (req, res) => {
  try {
    const record = await TheoDoiMuonSach.findById(req.params.id)
      .populate("MaDocGia")
      .populate("MaSach");

    if (!record) return res.status(404).json({ message: "Resource not found" });

    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Thêm mới
exports.create = async (req, res) => {
  try {
    const { MaDocGia, MaSach, NgayMuon, NgayTra } = req.body;

    // Tìm độc giả theo mã
    const docgia = await DocGia.findOne({ MaDocGia });
    if (!docgia) {
      return res.status(400).json({ error: `Không tìm thấy độc giả có mã ${MaDocGia}` });
    }

    // Tìm sách theo mã
    const sach = await Sach.findOne({ MaSach });
    if (!sach) {
      return res.status(400).json({ error: `Không tìm thấy sách có mã ${MaSach}` });
    }

    // Tạo bản ghi theo dõi mượn
    const record = await TheoDoiMuonSach.create({
      MaDocGia: docgia._id,
      MaSach: sach._id,
      NgayMuon,
      NgayTra
    });

    const populated = await TheoDoiMuonSach.findById(record._id)
      .populate("MaDocGia")
      .populate("MaSach");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Cập nhật
exports.update = async (req, res) => {
  try {
    const record = await TheoDoiMuonSach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!record) return res.status(404).json({ message: "Resource not found" });

    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa
exports.delete = async (req, res) => {
  try {
    const record = await TheoDoiMuonSach.findByIdAndDelete(req.params.id);

    if (!record) return res.status(404).json({ message: "Resource not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
