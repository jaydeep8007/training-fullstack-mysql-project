'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create the rolePermissions table
    await queryInterface.createTable('rolePermissions', {
      role_permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'role_id',
        },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'permission_id',
        },
        onDelete: 'CASCADE',
      },
    });

    // 2. Insert role-permission mappings
    await queryInterface.bulkInsert('rolePermissions', [
      // Super Admin (role_id: 1)
      { role_id: 1, permission_id: 1 }, // create
      { role_id: 1, permission_id: 2 }, // read
      { role_id: 1, permission_id: 3 }, // update
      { role_id: 1, permission_id: 4 }, // delete

      // Sub Admin (role_id: 2)
      { role_id: 2, permission_id: 2 }, // read
      { role_id: 2, permission_id: 3 }, // update
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rolePermissions', null, {});
    await queryInterface.dropTable('rolePermissions');
  },
};
