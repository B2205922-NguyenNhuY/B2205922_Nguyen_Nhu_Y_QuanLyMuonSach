const Sach = require('../models/Sach');

exports.createSach = async (req, res) => {
  try {
    const sach = new Sach(req.body);
    await sach.save();
    res.status(201).json(sach);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSach = async (req, res) => {
  try {
    const sachs = await Sach.find().populate('maNXB', 'tenNXB maNXB');
    res.json(sachs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSachById = async (req, res) => {
  try {
    const sach = await Sach.findById(req.params.id).populate('maNXB');
    if (!sach) return res.status(404).json({ msg: 'Không tìm thấy sách' });
    res.json(sach);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSach = async (req, res) => {
  try {
    const sach = await Sach.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sach);
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
