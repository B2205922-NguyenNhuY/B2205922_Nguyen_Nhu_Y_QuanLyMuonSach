const DocGia = require("../models/docgia.model");
const DocGiaService = require("../services/docgia.service");
const ApiError = require("../api-error");

// Lấy tất cả độc giả
exports.getAll = async (req, res, next) => {
  try {
    const list = await DocGiaService.findAll();
    res.json(list);
  } catch (err) {
    next(new ApiError(500, "Lỗi khi lấy danh sách độc giả"));
  }
};

// Lấy theo ID MongoDB
exports.getById = async (req, res, next) => {
  try {
    const docgia = await DocGiaService.findById(req.params.id);
    if (!docgia) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    res.json(docgia);
  } catch (err) {
    next(new ApiError(500, "Lỗi khi lấy độc giả"));
  }
};

// Lấy theo MaDocGia
exports.getByMaDocGia = async (req, res, next) => {
  try {
    const { MaDocGia } = req.params;
    const docgia = await DocGiaService.findByMaDocGia(MaDocGia);
    if (!docgia) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    res.json(docgia);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

// Thêm mới độc giả
exports.create = async (req, res, next) => {
  try {
    const newDG = await DocGiaService.create(req.body);
    res.json({ message: "Thêm độc giả thành công", data: newDG });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

// Cập nhật
exports.update = async (req, res, next) => {
  try {
    const updated = await DocGiaService.update(req.params.id, req.body);
    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    res.json(updated);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

// Xóa
exports.delete = async (req, res, next) => {
  try {
    const deleted = await DocGiaService.delete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    res.json({ message: "Đã xóa độc giả" });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

// Xóa tất cả
exports.deleteAll = async (req, res, next) => {
  try {
    const result = await DocGiaService.deleteAll();
    res.json({ message: `Đã xóa ${result.deletedCount} độc giả` });
  } catch (err) {
    next(new ApiError(500, "Lỗi khi xóa tất cả độc giả"));
  }
};
