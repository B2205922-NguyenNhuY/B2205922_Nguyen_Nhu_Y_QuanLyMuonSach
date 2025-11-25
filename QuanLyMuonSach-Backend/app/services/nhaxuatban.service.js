const NhaXuatBan = require('../models/nhaxuatban.model.js');

exports.create = async (data) => {
    const nxb = new NhaXuatBan(data);
    return await nxb.save();
};

exports.findAll = async () => {
    return await NhaXuatBan.find();
};

exports.findById = async (id) => {
    return await NhaXuatBan.findOne({ MaNXB: id });
};

exports.update = async (id, data) => {
    return await NhaXuatBan.findOneAndUpdate(
        { MaNXB: id },
        data,
        { new: true }
    );
};

exports.delete = async (id) => {
    return await NhaXuatBan.findOneAndDelete({ MaNXB: id });
};
