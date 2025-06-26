import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

const globalConfigModel = sequelize.define(
  'globalConfig',
  {
    global_config_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    global_config_label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    global_config_slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_global_config_slug', // ✅ Use named unique key
    },
    global_config_sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    global_config_json: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    global_config_fields: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    global_config_view: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'globalConfig',
    timestamps: true,
  },
);

export default globalConfigModel;
