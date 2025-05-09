const { Product, ProductImage, User } = require('../models');
const fs = require('fs');
const path = require('path');

module.exports = {
  createProduct: async (req, res) => {
    try {
      const { title, sku, description, quantity, price } = req.body;
      if (!title || !sku || !description || !quantity || price === undefined || price === null || price === "") {
        return res.status(400).json({ message: 'Semua field produk wajib diisi.' });
      }
      if (isNaN(price) || Number(price) < 0) {
        return res.status(400).json({ message: 'Harga produk tidak valid.' });
      }
      const exist = await Product.findOne({ where: { sku } });
      if (exist) {
        return res.status(409).json({ message: 'SKU sudah terdaftar.' });
      }
      const product = await Product.create({
        title,
        sku,
        description,
        quantity,
        price: Number(price),
        userId: req.user.id
      });
      // handle upload images
      let images = [];
      if (!req.files || req.files.length === 0) {
        // Jika tidak ada file yang diupload, hapus produk (rollback)
        await product.destroy();
        return res.status(400).json({ message: 'Gambar produk wajib diupload.' });
      }
      try {
        images = await Promise.all(req.files.map(async (file) => {
          return await ProductImage.create({
            url: `/uploads/${file.filename}`,
            productId: product.id
          });
        }));
      } catch (imgErr) {
        // Jika gagal simpan gambar, rollback produk
        await product.destroy();
        return res.status(500).json({ message: 'Gagal menyimpan gambar produk.', error: imgErr.message });
      }
      return res.status(201).json({ message: 'Produk berhasil ditambahkan', product, images });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          { model: ProductImage, as: 'images', attributes: ['id', 'url'] },
          { model: User, as: 'merchant', attributes: ['id', 'name', 'email'] }
        ]
      });
      return res.json(products);
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [
          { model: ProductImage, as: 'images', attributes: ['id', 'url'] },
          { model: User, as: 'merchant', attributes: ['id', 'name', 'email'] }
        ]
      });
      if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
      return res.json(product);
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, sku, description, qty } = req.body;
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
      if (product.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak.' });
      await product.update({ title, sku, description, qty });
      return res.json({ message: 'Produk berhasil diupdate', product });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, { include: [{ model: ProductImage, as: 'images' }] });
      if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
      if (product.userId !== req.user.id) return res.status(403).json({ message: 'Akses ditolak.' });
      // hapus file gambar dari server
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          const imgPath = path.join(__dirname, '..', 'uploads', path.basename(img.url));
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        });
      }
      await ProductImage.destroy({ where: { productId: id } });
      await product.destroy();
      return res.json({ message: 'Produk berhasil dihapus.' });
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
  }
};