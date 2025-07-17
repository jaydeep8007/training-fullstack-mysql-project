'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the `permissions` table
    await queryInterface.createTable('permissions', {
      permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      permission_slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    // Insert CRUD permissions
    await queryInterface.bulkInsert('permissions', [
      { permission_slug: 'create' },
      { permission_slug: 'read' },
      { permission_slug: 'update' },
      { permission_slug: 'delete' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permissions');
  },
};
