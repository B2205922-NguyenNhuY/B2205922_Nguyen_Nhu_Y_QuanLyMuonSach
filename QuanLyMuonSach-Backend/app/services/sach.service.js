const Sach = require("../models/sach.model");

exports.create = async (data) => {
    const sach = new Sach(data);
    return await sach.save();
};

exports.findAll = async () => {
    return await Sach.find();
};

exports.findById = async (id) => {
    return await Sach.findOne({ MaSach: id });
};

exports.update = async (id, data) => {
    return await Sach.findOneAndUpdate(
        { MaSach: id },
        data,
        { new: true }
    );
};

exports.delete = async (id) => {
    return await Sach.findOneAndDelete({ MaSach: id });
};

exports.deleteAll = async () => {
    const result = await Sach.deleteMany({});
    return result.deletedCount; // trả số lượng sách đã xóa
};