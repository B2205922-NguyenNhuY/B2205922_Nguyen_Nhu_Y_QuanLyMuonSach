const express = require('express');
const router = express.Router();
const sachCtrl = require('../controllers/sachController');

router.post('/', sachCtrl.createSach);
router.get('/', sachCtrl.getAllSach);
router.get('/:id', sachCtrl.getSachById);
router.put('/:id', sachCtrl.updateSach);
router.delete('/:id', sachCtrl.deleteSach);
router.delete('/', sachCtrl.deleteAllSach);

module.exports = router;
