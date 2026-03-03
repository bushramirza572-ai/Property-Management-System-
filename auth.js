const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token)
    return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("TOKEN OK:", decoded);
  req.user = decoded;
  next();
} catch (err) {
  console.log("JWT ERROR:", err.message);
  res.status(403).json({ message: 'Invalid or expired token' });
}
};
