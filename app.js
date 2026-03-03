const express = require('express');
const cors    = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// ← ADD THIS BLOCK
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/properties', require('./routes/property.routes'));
app.use('/api/tenants',    require('./routes/tenants.routes'));
app.use('/api/payments',   require('./routes/payment.routes'));
app.use('/api/users',      require('./routes/user.routes'));
app.get('/', (req, res) => res.json({ message: 'PMS API is running!' }));
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);
module.exports = app;