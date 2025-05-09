"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil user merchant
    const [merchant] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE email = \'merchant@example.com\' LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!merchant) throw new Error('Merchant user tidak ditemukan, jalankan user seeder dulu.');

    // Insert produk
    await queryInterface.bulkInsert("Products", [
      {
        title: "Premium Wireless Headphones",
        sku: "AUDIO001",
        description: "High-quality wireless headphones with noise cancellation and 24-hour battery life.",
        price: 149.99,
        quantity: 50,
        userId: merchant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Smart Fitness Tracker",
        sku: "WEAR002",
        description: "Track your activities, heart rate, sleep patterns and more with this advanced fitness tracker.",
        price: 89.99,
        quantity: 75,
        userId: merchant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Ultra HD Smart TV",
        sku: "TV003",
        description: "55-inch Ultra HD Smart TV with built-in streaming services and voice control.",
        price: 599.99,
        quantity: 15,
        userId: merchant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Professional Camera Kit",
        sku: "PHOTO004",
        description: "Complete professional camera kit with multiple lenses, tripod, and carrying case.",
        price: 1299.99,
        quantity: 8,
        userId: merchant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Ergonomic Office Chair",
        sku: "FURN005",
        description: "Comfortable ergonomic office chair with adjustable height, lumbar support, and breathable mesh back.",
        price: 249.99,
        quantity: 25,
        userId: merchant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Smart Home Security System",
        sku: "HOME006",
        description: "Complete smart home security system with cameras, sensors, and mobile app integration.",
        price: 349.99,
        quantity: 30,
        userId: merchant.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Insert product image (url dari uploads)
    await queryInterface.bulkInsert("ProductImages", [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        productId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b",
        productId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        url: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288",
        productId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        url: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9",
        productId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        url: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac",
        productId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        url: "https://images.unsplash.com/photo-1617196701537-7329482cc9fe",
        productId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1",
        productId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        url: "https://images.unsplash.com/photo-1558002038-1055907df827",
        productId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("ProductImages", { url: ["/uploads/product1.png"] }, {});
    await queryInterface.bulkDelete("Products", { sku: ["SKU001"] }, {});
  }
};