const NXB = require("../models/nhaxuatban.model.js");
const SachService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const sach = require("../models/sach.model.js");

// Lấy NXB theo MaNXB
exports.findOne = async (req, res, next) => {
  try {
    const { MaNXB } = req.params; // lấy MaNXB từ params
    const nxb = await NXB.findOne({ MaNXB });

    if (!nxb) {
      return next(new ApiError(404, `Không tìm thấy NXB với MaNXB: ${MaNXB}`));
    }

    res.json(nxb);
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

// Lấy tất cả NXB
exports.getAll = async (req, res, next) => {
    try {
        const list = await NXB.find();
        res.json(list);
    } catch (err) {
        next(new ApiError(500, "Lỗi khi lấy danh sách nhà xuất bản"));
    }
};

// Thêm mới
exports.create = async (req, res, next) => {
    try {
        const nxb = new NXB(req.body);
        await nxb.save();
        res.json({ message: "Thêm nhà xuất bản thành công", data: nxb });
    } catch (err) {
        next(new ApiError(400, err.message));
    }
};

// Cập nhật
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updated = await NXB.findByIdAndUpdate(id, req.body, { new: true });

        if (!updated) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }

        res.json(updated);
    } catch (err) {
        next(new ApiError(400, err.message));
    }
};

exports.getNXBById = async (req, res) => {
  try {
    const nxb = await NXB.findById(req.params.id)
    if (!nxb) return res.status(404).json({ msg: 'Không tìm thấy nhà xuất bản' });
    res.json(nxb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa
exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deleted = await NXB.findByIdAndDelete(id);

        if (!deleted) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        }

        res.json({ message: "Đã xóa nhà xuất bản" });
    } catch (err) {
        next(new ApiError(400, err.message));
    }
};

exports.deleteAll = async (req, res) => {
  try {
    const result = await NXB.deleteMany({});
    res.json({ msg: `Đã xóa ${result.deletedCount} nxb` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};