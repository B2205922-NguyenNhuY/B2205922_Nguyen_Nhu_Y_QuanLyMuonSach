const express = require("express");
const router = express.Router();
const nxbController = require("../controllers/nhaxuatbanController");

router.get("/", nxbController.getAll);
router.post("/", nxbController.create);
router.put("/:id", nxbController.update);
router.delete("/:id", nxbController.delete);
router.delete('/', nxbController.deleteAll);

module.exports = router;
