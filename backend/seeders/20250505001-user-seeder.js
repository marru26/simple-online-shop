"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        name: "Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Merchant Demo",
        email: "merchant@example.com",
        password: await bcrypt.hash("merchant123", 10),
        role: "merchant",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "User Demo",
        email: "user@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", {
      email: ["merchant@example.com", "user@example.com"]
    }, {});
  }
};