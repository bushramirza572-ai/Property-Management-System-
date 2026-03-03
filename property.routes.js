const express    = require('express');
const router     = express.Router();
const propCtrl   = require('../controllers/property.controller');
const authMiddle = require('../middleware/auth');


router.get('/',      authMiddle, propCtrl.getAll);
router.get('/:id',   authMiddle, propCtrl.getById);
router.post('/',     authMiddle, propCtrl.create);
router.put('/:id',   authMiddle, propCtrl.update);
router.delete('/:id',authMiddle, propCtrl.remove);

module.exports = router;
