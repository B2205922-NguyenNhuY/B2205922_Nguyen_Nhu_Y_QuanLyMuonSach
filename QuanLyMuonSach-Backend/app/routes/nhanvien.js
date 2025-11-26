const express = require('express');
const router = express.Router();
const nhanvienController = require('../controllers/nhanvienController');

router.route("/")
    .get(nhanvienController.getAll)
    .post(nhanvienController.create)
    .delete(nhanvienController.deleteAll);

router.route("/:id")
    .get(nhanvienController.getNhanVienById)
    .put(nhanvienController.update)
    .delete(nhanvienController.delete);

module.exports = router;
