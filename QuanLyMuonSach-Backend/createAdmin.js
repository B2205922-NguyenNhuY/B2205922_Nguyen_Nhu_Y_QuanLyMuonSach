const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const NhanVien = require("./models/NhanVien");

const createAdmin = async () => {
  try {
    // Kết nối tới MongoDB.
    await mongoose.connect("mongodb://localhost:27017/library-management", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminExists = await NhanVien.findOne({ MSNV: "admin04"});
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 8);
      const admin = new NhanVien({
        MSNV: "admin04",
        hoTenNV: "Admin",
        password: hashedPassword,
        chucVu: "Admin",
        diaChi: "Admin Adress",
        soDienThoai: "0912345678"
      });
      await admin.save();
      console.log("Default admin created");
    } else {
      console.log("Admin account already exists");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    // Đóng kết nối sau khi hoàn thành
    await mongoose.connection.close();
  }
};

createAdmin();
