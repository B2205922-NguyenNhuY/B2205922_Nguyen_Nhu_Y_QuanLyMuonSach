const express = require('express');
const router = express.Router();
const docgia = require('../controllers/docgiaController');

router.route("/:MaDocGia").get(docgia.getByMaDocGia);

router.route("/")
    .get(docgia.getAll)
    .post(docgia.create)
    .delete(docgia.deleteAll);

router.route("/:id")
    .get(docgia.getById)
    .put(docgia.update)
    .delete(docgia.delete);


module.exports = router;
