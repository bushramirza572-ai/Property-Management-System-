const express = require('express');
const router = express.Router();
const authMiddle = require('../middleware/auth');
const ctrl = require('../controllers/user.controller');
const db = require('../config/db');

// Get all tenant users
router.get('/', authMiddle, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role FROM users WHERE role = 'tenant'"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user by ID
router.get('/:id', authMiddle, ctrl.getById);

// Update profile
router.put('/:id', authMiddle, ctrl.update);

// Change password
router.patch('/:id/password', authMiddle, ctrl.changePassword);

module.exports = router;