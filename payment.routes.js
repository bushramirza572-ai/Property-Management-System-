const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/payment.controller');
const auth    = require('../middleware/auth');
const db      = require('../config/db'); // ✅ ADD THIS

router.get('/stats',   auth, ctrl.getStats);      
router.get('/',        auth, ctrl.getAll);
router.get('/me',      auth, ctrl.getMyPayments); 
router.get('/:id',     auth, ctrl.getById);
router.post('/',       auth, ctrl.create);
router.put('/:id',     auth, ctrl.update);
router.delete('/:id',  auth, ctrl.remove);

// ✅ FIXED PATCH
router.patch('/:id', auth, async (req, res) => {
  const { status, payment_date } = req.body;

  try {
    const sql = `
      UPDATE payments 
      SET status = ?, payment_date = ? 
      WHERE id = ?
    `;

    await db.execute(sql, [status, payment_date, req.params.id]);

    res.json({ message: 'Payment updated successfully' });

  } catch (err) {
    console.error('PATCH ERROR:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;