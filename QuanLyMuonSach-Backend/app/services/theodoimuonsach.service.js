const TheoDoiMuonSach = require("../models/theodoimuonsach.model");

class TheoDoiMuonSachService {

    async create(data) {
        const record = new TheoDoiMuonSach(data);
        return await record.save();
    }

    async findAll() {
        return await TheoDoiMuonSach.find()
            .populate("MaDocGia")
            .populate("MaSach");
    }

    async findById(id) {
        return await TheoDoiMuonSach.findById(id)
            .populate("MaDocGia")
            .populate("MaSach");
    }

    async update(id, data) {
        return await TheoDoiMuonSach.findByIdAndUpdate(id, data, { new: true })
            .populate("MaDocGia")
            .populate("MaSach");
    }

    async delete(id) {
        return await TheoDoiMuonSach.findByIdAndDelete(id);
    }

    async deleteAll() {
        return await TheoDoiMuonSach.deleteMany({});
    }
}

module.exports = new TheoDoiMuonSachService();
