const NhanVien = require('../models/nhanvien.model');

class NhanVienService {
  async create(data) {
    const nhanvien = new NhanVien(data);
    return await nhanvien.save();
  }

  async getAll() {
    return await NhanVien.find();
  }

  async getById(id) {
    return await NhanVien.findById(id);
  }

  async update(id, data) {
    return await NhanVien.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await NhanVien.findByIdAndDelete(id);
  }

  async deleteAll() {
    return await NhanVien.deleteMany({});
  }
}

module.exports = new NhanVienService();
