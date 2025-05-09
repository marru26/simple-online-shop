const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create product (merchant only, bisa upload multiple images)
router.post('/', authMiddleware(['merchant']), upload.array('images', 5), productController.createProduct);
// Get all products (public)
router.get('/', productController.getAllProducts);
// Get product by id (public)
router.get('/:id', productController.getProductById);
// Update product (merchant only)
router.put('/:id', authMiddleware(['merchant']), productController.updateProduct);
// Delete product (merchant only)
router.delete('/:id', authMiddleware(['merchant']), productController.deleteProduct);
router.get('/uploads/:filename', (req, res) => {
  const options = {
    root: path.join(__dirname, '..', 'uploads')
  };
  const fileName = req.params.filename;
  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.status(404).json({ message: 'File tidak ditemukan.' });
    }
  });
});
module.exports = router;