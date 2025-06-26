'use strict';

const { v4: uuidv4 } = require('uuid');

// ✅ Load your config JSON files
const smtpConfig = require('./data/smtpSettings.json');
const emailConfig = require('./data/emailSettings.json');
const languageConfig = require('./data/languageSettings.json');

// ✅ List of configs to process
const configs = [smtpConfig, emailConfig, languageConfig];

module.exports = {
  async up(queryInterface, Sequelize) {
    const inserted = [];
    const skipped = [];

    for (const config of configs) {
      // 🔍 Check if config with same slug already exists
      const [existing] = await queryInterface.sequelize.query(
        `SELECT * FROM globalConfig WHERE global_config_slug = :slug LIMIT 1`,
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

      // ✅ Insert new config
      await queryInterface.bulkInsert('globalConfig', [
        {
          global_config_id: uuidv4(),
          global_config_label: config.global_config_label,
          global_config_slug: config.global_config_slug,
          global_config_sequence: config.global_config_sequence,
          global_config_json: JSON.stringify(config.global_config_json),
          global_config_fields: JSON.stringify(config.global_config_fields),
          global_config_view: config.global_config_view,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      inserted.push(config.global_config_slug);
      console.log(`✅ Inserted: '${config.global_config_slug}' added to globalConfig.`);
    }

    // 📋 Summary
    console.log('\n📋 Migration Summary:');
    if (inserted.length) {
      console.log(`🟢 Inserted: ${inserted.join(', ')}`);
    }
    if (skipped.length) {
      console.log(`🟡 Skipped: ${skipped.join(', ')}`);
    }
  },

  async down(queryInterface, Sequelize) {
    const slugs = configs.map(config => config.global_config_slug);
    await queryInterface.bulkDelete('globalConfig', {
      global_config_slug: slugs,
    });
  },
};
