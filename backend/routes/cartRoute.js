const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// Semua endpoint cart hanya untuk user yang sudah login
router.post('/', authMiddleware(['user']), cartController.addToCart);
router.put('/:id', authMiddleware(['user']), cartController.updateCart);
router.delete('/:id', authMiddleware(['user']), cartController.removeFromCart);
router.get('/', authMiddleware(['user']), cartController.getCart);
router.post('/checkout', authMiddleware(['user']), cartController.checkout);

module.exports = router;