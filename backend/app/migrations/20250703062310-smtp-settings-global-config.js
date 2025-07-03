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
    const errors = [];

    // 🔍 Fetch all existing sequences and slugs
    const existingConfigs = await queryInterface.sequelize.query(
      `SELECT global_config_slug, global_config_sequence FROM globalConfig ORDER BY global_config_sequence ASC`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const existingSequences = existingConfigs.map((c) => c.global_config_sequence);
    const existingSlugs = existingConfigs.map((c) => c.global_config_slug);

    // 🔢 Detect sequence gaps
    const sequenceGap = existingSequences.some((seq, index, arr) => {
      return index > 0 && seq - arr[index - 1] > 1;
    });

    if (sequenceGap) {
      console.log('❌ Sequence gap detected in existing data. Please fix before continuing.');
      return;
    }

    let nextSequence =
      existingSequences.length > 0 ? Math.max(...existingSequences) + 1 : 1;

    for (const config of configs) {
      const slug = config.global_config_slug;
      let sequence = config.global_config_sequence;

      // ❌ Skip if slug already exists
      if (existingSlugs.includes(slug)) {
        skipped.push(slug);
        console.log(`⚠️  Skipped: '${slug}' already exists.`);
        continue;
      }

      // ✅ Auto-assign sequence if not provided
      if (typeof sequence !== 'number') {
        config.global_config_sequence = nextSequence++;
        console.log(`ℹ️  Auto-assigned sequence ${config.global_config_sequence} to '${slug}'`);
      } else {
        // ❌ Check for duplicate sequence
        if (existingSequences.includes(sequence)) {
          errors.push(`❌ Sequence ${sequence} already exists for '${slug}'`);
          continue;
        }

        // ✅ Otherwise, reserve this sequence
        existingSequences.push(sequence);
        existingSequences.sort((a, b) => a - b);
        nextSequence = Math.max(...existingSequences) + 1;
      }

      // ✅ Insert new config (using `global_config_json_value`)
      await queryInterface.bulkInsert('globalConfig', [
        {
          global_config_id: uuidv4(),
          global_config_label: config.global_config_label,
          global_config_slug: slug,
          global_config_sequence: config.global_config_sequence,
          global_config_json: JSON.stringify(config.global_config_json_value),
          global_config_fields: JSON.stringify(config.global_config_fields),
          global_config_view: config.global_config_view,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      inserted.push(slug);
      console.log(`✅ Inserted: '${slug}' added to globalConfig.`);
    }

    // 📋 Summary
    console.log('\n📋 Migration Summary:');
    if (inserted.length) {
      console.log(`🟢 Inserted: ${inserted.join(', ')}`);
    }
    if (skipped.length) {
      console.log(`🟡 Skipped (slug exists): ${skipped.join(', ')}`);
    }
    if (errors.length) {
      console.log(`❌ Errors:\n${errors.join('\n')}`);
    }
  },

  async down(queryInterface, Sequelize) {
    const slugs = configs.map((config) => config.global_config_slug);
    await queryInterface.bulkDelete('globalConfig', {
      global_config_slug: slugs,
    });
  },
};
