const express = require('express');
const router = express.Router();
const sachCtrl = require('../controllers/sachController');

router.route("/")
    .get(sachCtrl.getAllSach)
    .post(sachCtrl.createSach)
    .delete(sachCtrl.deleteAllSach);

router.route("/:id")
    .get(sachCtrl.getSachById)
    .put(sachCtrl.updateSach)
    .delete(sachCtrl.deleteSach);

module.exports = router;
