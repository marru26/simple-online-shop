require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const { sequelize } = require('./models');

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));
app.use(cors({ origin: 'http://localhost:8080' }));

// Routes
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');

app.use('/api', userRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);

// Error handler
app.use((err, req, res, next) => {
  return res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });