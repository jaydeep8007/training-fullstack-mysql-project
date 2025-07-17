'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Create `roles` table
    await queryInterface.createTable('roles', {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    // 2️⃣ Insert initial roles
    await queryInterface.bulkInsert('roles', [
      { role_name: 'Super Admin' },
      { role_name: 'Sub Admin' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Drop the table
    await queryInterface.dropTable('roles');
  },
};
 order: [['createdAt', 'DESC']]