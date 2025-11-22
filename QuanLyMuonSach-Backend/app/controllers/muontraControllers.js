const TheoDoi = require('../models/TheoDoiMuonSach');
const Sach = require('../models/Sach');

exports.muonSach = async (req, res) => {
  try {
    const { maDocGia, maSach, msnv, ngayHenTra } = req.body;
    // tạo bản ghi theo dõi
    const theodoi = new TheoDoi({ maDocGia, maSach, msnv, ngayHenTra });
    await theodoi.save();
    // cập nhật số lượng sách nếu muốn
    await Sach.findByIdAndUpdate(maSach, { $inc: { soQuyen: -1 } });
    res.status(201).json(theodoi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.traSach = async (req, res) => {
  try {
    const { id } = req.params; // id của record theo dõi
    const record = await TheoDoi.findById(id);
    if (!record) return res.status(404).json({ msg: 'Không tồn tại' });
    record.trangThai = 'tra';
    record.ngayTra = new Date();
    await record.save();
    await Sach.findByIdAndUpdate(record.maSach, { $inc: { soQuyen: 1 } });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
