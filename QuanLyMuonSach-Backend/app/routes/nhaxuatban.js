const express = require("express");
const router = express.Router();
const nxbController = require("../controllers/nhaxuatbanController");

router.route("/")
    .get(nxbController.getAll)
    .post(nxbController.create)
    .delete(nxbController.deleteAll);

router.route("/:id")
    .get(nxbController.getNXBById)
    .put(nxbController.update)
    .delete(nxbController.delete);

module.exports = router;
