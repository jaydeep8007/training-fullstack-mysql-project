import sequelize from '../config/sequelize';
import { DataTypes } from 'sequelize';

const adminAuthModel = sequelize.define(
  'adminAuth',
  {
    admin_auth_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admin',
        key: 'admin_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    admin_auth_token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    admin_auth_refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'unique_admin_refresh_token',
        unique: true,
        fields: ['admin_auth_refresh_token'],
      },
    ],
  }
);

export default adminAuthModel;
