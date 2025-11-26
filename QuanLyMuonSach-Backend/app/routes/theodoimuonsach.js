const express = require("express");
const router = express.Router();
const muonsachCtrl = require("../controllers/theodoimuonsachController");

router.route("/")
    .get(muonsachCtrl.getAll)
    .post(muonsachCtrl.create)
    //.delete(muonsachCtrl.deleteAll);

router.route("/:id")
    .get(muonsachCtrl.getById)
    .put(muonsachCtrl.update)
    .delete(muonsachCtrl.delete);

module.exports = router;
