const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    // Regular user — only see their assigned property
    if (req.user.role !== 'admin') {
      const [rows] = await db.query(`
        SELECT p.* FROM properties p
        JOIN tenants t ON t.property_id = p.id
        WHERE t.user_id = ?
        ORDER BY p.created_at DESC
      `, [req.user.id]);
      return res.json(rows);
    }

    // Admin — see all properties
    const [rows] = await db.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Property not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, address, type, rent_amount, status } = req.body;
    await db.query(
      'INSERT INTO properties (name, address, type, rent_amount, status) VALUES (?, ?, ?, ?, ?)',
      [name, address, type, rent_amount, status || 'available']
    );
    res.status(201).json({ message: 'Property created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, address, type, rent_amount, status } = req.body;
    await db.query(
      'UPDATE properties SET name=?, address=?, type=?, rent_amount=?, status=? WHERE id=?',
      [name, address, type, rent_amount, status, req.params.id]
    );
    res.json({ message: 'Property updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM properties WHERE id = ?', [req.params.id]);
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};