const { Cart, Product, User } = require('../models');
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      if (!productId || !quantity) {
        return res.status(400).json({ message: 'ProductId dan quantity wajib diisi.' });
      }
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
      let cart = await Cart.findOne({ where: { userId: req.user.id, productId } });
      if (cart) {
        cart.quantity += Number(quantity);
        await cart.save();
      } else {
        cart = await Cart.create({ userId: req.user.id, productId, quantity });
      }
      return res.status(201).json({ message: 'Produk ditambahkan ke keranjang', cart });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  updateCart: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const cart = await Cart.findByPk(id);
      if (!cart) return res.status(404).json({ message: 'Item keranjang tidak ditemukan.' });
      if (cart.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak.' });
      cart.quantity = quantity;
      await cart.save();
      return res.json({ message: 'Keranjang diupdate', cart });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  removeFromCart: async (req, res) => {
    try {
      const { id } = req.params;
      const cart = await Cart.findByPk(id);
      if (!cart) return res.status(404).json({ message: 'Item keranjang tidak ditemukan.' });
      if (cart.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak.' });
      await cart.destroy();
      return res.json({ message: 'Item dihapus dari keranjang.' });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  getCart: async (req, res) => {
    try {
      const cart = await Cart.findAll({
        where: { userId: req.user.id },
        include: [{ model: Product, as: 'product' }]
      });
      return res.json(cart);
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  checkout: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      const cart = await Cart.findAll({
        where: { userId: req.user.id },
        include: [{ model: Product, as: 'product' }]
      });
      if (!cart.length) {
        return res.status(400).json({ message: 'Keranjang kosong.' });
      }
      // Simulasi pengurangan stok produk
      for (const item of cart) {
        if (item.product.qty < item.quantity) {
          return res.status(400).json({ message: `Stok produk ${item.product.title} tidak cukup.` });
        }
      }
      for (const item of cart) {
        item.product.quantity -= item.quantity;
        await item.product.save();
      }
      // Kirim email notifikasi (simulasi)
      const transporter = nodemailer.createTransport({
        host: 'smtp.imitate.email',
        port: 587,
        secure: false,
        auth: {
          user: 'DQcYZvUtL0KJ1QGWtNVjsg',
          pass: 'mOnJGHqnAo0q4nHHDw7o'
        },
      });
      const productList = cart.map(item => `${item.product.title} x${item.quantity}`).join(', ');
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Checkout Berhasil',
        text: `Terima kasih telah berbelanja. Pesanan Anda: ${productList}`
      });
      // Kosongkan keranjang
      await Cart.destroy({ where: { userId: req.user.id } });
      return res.json({ message: 'Checkout berhasil. Email notifikasi telah dikirim.' });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  }
};