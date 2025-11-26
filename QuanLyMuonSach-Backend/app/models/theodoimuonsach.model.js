const mongoose = require('mongoose');

const TheoDoiMuonSachSchema = new mongoose.Schema({
  MaDocGia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocGia',
    required: true,
  },
  MaSach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sach',
    required: true,
  },
  NgayMuon: { type: Date, default: Date.now },
  NgayTra: { type: Date },
  TrangThai: { type: String, enum: ['dang_muon', 'da_tra'], default: 'dang_muon' },
});

module.exports = mongoose.model('TheoDoiMuonSach', TheoDoiMuonSachSchema);
