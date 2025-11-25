const { MongoClient } = require("mongodb");

class MongoDB {
    static client = null; // Khai báo thuộc tính static để lưu trữ kết nối

    static connect = async (uri) => {
        // Nếu đã có kết nối (client) tồn tại, trả về kết nối đó
        if (this.client) return this.client;

        // Nếu chưa có, tạo một kết nối mới và lưu trữ vào this.client
        this.client = await MongoClient.connect(uri);
        return this.client;
    };
}

module.exports = MongoDB;