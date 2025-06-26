// app/migrations/20250625105012-create-global-config.js

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('globalConfig', {
      global_config_id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('(UUID())'),
        primaryKey: true,
      },
      global_config_label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      global_config_slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      global_config_sequence: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      global_config_json: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      global_config_fields: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      global_config_view: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('globalConfig');
  },
};
