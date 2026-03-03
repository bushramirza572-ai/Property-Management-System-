const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email } = req.body;
      if (parseInt(req.params.id) !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });
    await db.query(
      'UPDATE users SET name=?, email=? WHERE id=?',
      [name, email, req.params.id]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (parseInt(req.params.id) !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    const [users] = await db.query('SELECT * FROM users WHERE id=?', [req.params.id]);
    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password=? WHERE id=?', [hashed, req.params.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
