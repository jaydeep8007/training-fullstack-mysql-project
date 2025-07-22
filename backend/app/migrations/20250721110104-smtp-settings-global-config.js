'use strict';

const { v4: uuidv4 } = require('uuid');

// ✅ Load your config JSON files
const smtpConfig = require('./data/smtpSettings.json');
const emailConfig = require('./data/emailSettings.json');
const languageConfig = require('./data/languageSettings.json');

const configs = [smtpConfig, emailConfig, languageConfig];

module.exports = {
  async up(queryInterface, Sequelize) {
    const inserted = [];
    const skipped = [];

    for (const config of configs) {
      const [existing] = await queryInterface.sequelize.query(
        `SELECT global_config_slug FROM globalConfig WHERE global_config_slug = :slug LIMIT 1`,
        {
          replacements: { slug: config.global_config_slug },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existing) {
        skipped.push(config.global_config_slug);
        console.log(`⚠️  Skipped: '${config.global_config_slug}' already exists.`);
        continue;
      }

      await queryInterface.bulkInsert('globalConfig', [
        {
          global_config_id: uuidv4(),
          global_config_label: config.global_config_label,
          global_config_slug: config.global_config_slug,
          global_config_sequence: config.global_config_sequence,
          global_config_json_value: JSON.stringify(config.global_config_json_value), // ✅ corrected field name
          global_config_fields: JSON.stringify(config.global_config_fields),
          global_config_view: config.global_config_view,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      inserted.push(config.global_config_slug);
      console.log(`✅ Inserted: '${config.global_config_slug}'`);
    }

    console.log('\n📋 Global Config Migration Summary:');
    if (inserted.length) console.log(`🟢 Inserted: ${inserted.join(', ')}`);
    if (skipped.length) console.log(`🟡 Skipped: ${skipped.join(', ')}`);
  },

  async down(queryInterface, Sequelize) {
    const slugs = configs.map(config => config.global_config_slug);
    await queryInterface.bulkDelete('globalConfig', {
      global_config_slug: slugs,
    });

    console.log(`🧹 Deleted configs: ${slugs.join(', ')}`);
  },
};
