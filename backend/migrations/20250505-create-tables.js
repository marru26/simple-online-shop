"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM("admin", "merchant", "user"), allowNull: false, defaultValue: "user" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.createTable("Products", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING, allowNull: false },
      sku: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onDelete: "CASCADE" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.createTable("ProductImages", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      url: { type: Sequelize.TEXT, allowNull: false },
      productId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Products", key: "id" }, onDelete: "CASCADE" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.createTable("Carts", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Users", key: "id" }, onDelete: "CASCADE" },
      productId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Products", key: "id" }, onDelete: "CASCADE" },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Carts");
    await queryInterface.dropTable("ProductImages");
    await queryInterface.dropTable("Products");
    await queryInterface.dropTable("Users");
  }
};