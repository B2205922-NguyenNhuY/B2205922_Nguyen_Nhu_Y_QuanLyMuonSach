const DocGia = require("../models/docgia.model");

class DocGiaService {
    async create(payload) {
        const docgia = new DocGia(payload);
        return await docgia.save();
    }

    async findAll() {
        return await DocGia.find();
    }

    async findById(id) {
        return await DocGia.findById(id);
    }

    async findByMaDocGia(MaDocGia) {
        return await DocGia.findOne({ MaDocGia });
    }

    async update(id, data) {
        return await DocGia.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await DocGia.findByIdAndDelete(id);
    }

    async deleteAll() {
        return await DocGia.deleteMany({});
    }
}

module.exports = new DocGiaService();
