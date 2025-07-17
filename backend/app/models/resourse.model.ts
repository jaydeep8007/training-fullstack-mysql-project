// models/Resource.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class resourceModel extends Model {}

resourceModel.init(
  {
    resource_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    resource_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'resources',
    timestamps: false,
  }
);

export default resourceModel;
