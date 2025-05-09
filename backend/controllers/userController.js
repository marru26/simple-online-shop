const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
      }
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: 'Email sudah terdaftar.' });
      }
      const user = await User.create({ name, email, password, role });
      return res.status(201).json({ message: 'Registrasi berhasil', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi.' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Email tidak ditemukan.' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Password salah.' });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ message: 'Login berhasil', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  }
};