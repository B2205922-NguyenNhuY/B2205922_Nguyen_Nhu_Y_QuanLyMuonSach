const NhanVien = require("../models/nhanvien.model");
const ApiError = require("../api-error");

// Lấy nhân viên theo ID
exports.findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nhanvien = await NhanVien.findById(id);

    if (!nhanvien) {
      return next(new ApiError(404, `Không tìm thấy nhân viên với ID: ${id}`));
    }

    res.json(nhanvien);
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

// Lấy tất cả nhân viên
exports.getAll = async (req, res, next) => {
  try {
    const list = await NhanVien.find();
    res.json(list);
  } catch (err) {
    next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
  }
};

// Thêm mới nhân viên
exports.create = async (req, res, next) => {
  try {
    const nhanvien = new NhanVien(req.body);
    await nhanvien.save();
    res.json({ message: "Thêm nhân viên thành công", data: nhanvien });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

// Cập nhật nhân viên
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updated = await NhanVien.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }

    res.json(updated);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

// Lấy nhân viên theo ID
exports.getNhanVienById = async (req, res) => {
  try {
    const nhanvien = await NhanVien.findById(req.params.id)
      // .populate('PhongBan') // nếu muốn join với phòng ban
      // .populate('ChucVu');  // nếu muốn join với chức vụ

    if (!nhanvien) {
      return res.status(404).json({ msg: 'Không tìm thấy nhân viên' });
    }

    res.json(nhanvien);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa nhân viên theo ID
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await NhanVien.findByIdAndDelete(id);

    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }

    res.json({ message: "Đã xóa nhân viên" });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

// Xóa tất cả nhân viên
exports.deleteAll = async (req, res) => {
  try {
    const result = await NhanVien.deleteMany({});
    res.json({ msg: `Đã xóa ${result.deletedCount} nhân viên` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
