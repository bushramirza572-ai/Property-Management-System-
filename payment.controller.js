const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pay.*, u.name AS tenant_name, p.name AS property_name
      FROM payments pay
      JOIN tenants t ON pay.tenant_id = t.id
      JOIN users u ON t.user_id = u.id
      JOIN properties p ON pay.property_id = p.id
      ORDER BY pay.due_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pay.*, p.name AS property_name
      FROM payments pay
      JOIN tenants t ON pay.tenant_id = t.id
      JOIN properties p ON pay.property_id = p.id
      WHERE t.user_id = ?
      ORDER BY pay.due_date DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM payments WHERE id = ?', [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { tenant_id, property_id, amount, payment_date, due_date, status, notes } = req.body;
    await db.query(
      `INSERT INTO payments (tenant_id, property_id, amount, payment_date,
       due_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tenant_id, property_id, amount, payment_date || null,
       due_date, status || 'pending', notes || null]
    );
    res.status(201).json({ message: 'Payment recorded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { amount, payment_date, due_date, status, notes } = req.body;
    await db.query(
      `UPDATE payments SET amount=?, payment_date=?, due_date=?,
       status=?, notes=? WHERE id=?`,
      [amount, payment_date || null, due_date, status, notes || null, req.params.id]
    );
    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM payments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [[{ totalProperties }]] = await db.query(
      'SELECT COUNT(*) AS totalProperties FROM properties'
    );
    const [[{ totalTenants }]] = await db.query(
      'SELECT COUNT(*) AS totalTenants FROM tenants'
    );
    const [[{ totalPaid }]] = await db.query(
      "SELECT COALESCE(SUM(amount),0) AS totalPaid FROM payments WHERE status='paid'"
    );
    const [[{ totalPending }]] = await db.query(
      "SELECT COALESCE(SUM(amount),0) AS totalPending FROM payments WHERE status='pending'"
    );
    const [[{ overdueCount }]] = await db.query(
      "SELECT COUNT(*) AS overdueCount FROM payments WHERE status='overdue'"
    );
    res.json({ totalProperties, totalTenants, totalPaid, totalPending, overdueCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
