const db = require('../config/db');

// GET ALL TENANTS
exports.getAll = async (req, res) => {
  try {
   if (req.user.role !== 'admin') {
      const [rows] = await db.query(`
        SELECT t.*, 
               u.name AS tenant_name, 
               u.email AS tenant_email,
               p.name AS property_name, 
               p.address AS property_address,
               p.rent_amount
        FROM tenants t
        JOIN users u ON t.user_id = u.id
        JOIN properties p ON t.property_id = p.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
      `, [req.user.id]);

      return res.json(rows);
    }

    // Admin — return all tenants
    const [rows] = await db.query(`
      SELECT t.*, 
             u.name AS tenant_name, 
             u.email AS tenant_email,
             p.name AS property_name, 
             p.address AS property_address,
             p.rent_amount
      FROM tenants t
      JOIN users u ON t.user_id = u.id
      JOIN properties p ON t.property_id = p.id
      ORDER BY t.created_at DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error("GET ALL TENANTS ERROR:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// GET TENANT BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, 
             u.name AS tenant_name, 
             u.email AS tenant_email,
             p.name AS property_name, 
             p.rent_amount
      FROM tenants t
      JOIN users u ON t.user_id = u.id
      JOIN properties p ON t.property_id = p.id
      WHERE t.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("GET TENANT BY ID ERROR:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// GET MY RECORD (Logged-in User)
exports.getMyRecord = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, 
             u.name AS tenant_name, 
             u.email AS tenant_email,
             p.name AS property_name, 
             p.address AS property_address,
             p.rent_amount
      FROM tenants t
      JOIN users u ON t.user_id = u.id
      JOIN properties p ON t.property_id = p.id
      WHERE t.user_id = ?
    `, [req.user.id]);

    res.json(rows);

  } catch (err) {
    console.error("GET MY RECORD ERROR:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// CREATE TENANT
exports.create = async (req, res) => {
  try {
    const { user_id, property_id, phone, lease_start, lease_end } = req.body;

    console.log("Creating tenant body:", req.body);

    // Basic Validation
    if (!user_id || !property_id) {
      return res.status(400).json({
        message: "User ID and Property ID are required"
      });
    }

    const userIdNumber = Number(user_id);
    const propertyIdNumber = Number(property_id);

    if (isNaN(userIdNumber) || isNaN(propertyIdNumber)) {
      return res.status(400).json({
        message: "User ID and Property ID must be valid numbers"
      });
    }

    //  Update property status to occupied
    await db.query(
      "UPDATE properties SET status = 'occupied' WHERE id = ?",
      [propertyIdNumber]
    );

    // Insert tenant
    await db.query(
      `INSERT INTO tenants 
       (user_id, property_id, phone, lease_start, lease_end)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userIdNumber,
        propertyIdNumber,
        phone || null,
        lease_start || null,
        lease_end || null
      ]
    );

    res.status(201).json({ message: 'Tenant created successfully' });

  } catch (err) {
    console.error("CREATE TENANT ERROR:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// UPDATE TENANT
exports.update = async (req, res) => {
  try {
    const { user_id, property_id, phone, lease_start, lease_end } = req.body;

    await db.query(
      `UPDATE tenants 
       SET user_id = ?, 
           property_id = ?, 
           phone = ?, 
           lease_start = ?, 
           lease_end = ?
       WHERE id = ?`,
      [
        Number(user_id),
        Number(property_id),
        phone || null,
        lease_start || null,
        lease_end || null,
        req.params.id
      ]
    );

    res.json({ message: 'Tenant updated successfully' });

  } catch (err) {
    console.error("UPDATE TENANT ERROR:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// DELETE TENANT
exports.remove = async (req, res) => {
  try {
    // Get property_id before deleting tenant
    const [tenant] = await db.query(
      'SELECT property_id FROM tenants WHERE id = ?',
      [req.params.id]
    );

    if (tenant.length > 0) {
      await db.query(
        "UPDATE properties SET status = 'available' WHERE id = ?",
        [tenant[0].property_id]
      );
    }

    await db.query(
      'DELETE FROM tenants WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Tenant deleted successfully' });

  } catch (err) {
    console.error("DELETE TENANT ERROR:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};