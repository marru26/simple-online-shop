const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (roles = []) {
  // roles: array of allowed roles, contoh: ['merchant']
  return function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token tidak valid.' });
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Akses ditolak.' });
      }
      req.user = user;
      next();
    });
  };
};