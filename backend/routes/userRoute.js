const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Register
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
// Get all users (hanya untuk admin/merchant, contoh penggunaan middleware)
router.get('/users', authMiddleware(['admin']), userController.getAllUsers);

module.exports = router;