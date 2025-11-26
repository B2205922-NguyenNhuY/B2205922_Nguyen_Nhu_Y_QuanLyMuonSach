const express = require("express");
const router = express.Router();
const muonsachCtrl = require("../controllers/theodoimuonsachController");
const auth = require("../middlewares/auth.middleware"); // import middleware auth

// Routes cho tất cả các thao tác, chỉ cho phép nhân viên đã đăng nhập
router.route("/")
    .get(auth, muonsachCtrl.getAll)    // đọc danh sách mượn sách, phải đăng nhập
    .post(auth, muonsachCtrl.create);  // tạo ghi nhận mượn sách, phải đăng nhập

router.route("/:id")
    .get(auth, muonsachCtrl.getById)    // xem chi tiết, phải đăng nhập
    .put(auth, muonsachCtrl.update)     // cập nhật, phải đăng nhập
    .delete(auth, muonsachCtrl.delete); // xóa, phải đăng nhập

module.exports = router;
