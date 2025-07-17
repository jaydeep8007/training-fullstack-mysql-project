import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class roleModel extends Model {
  public role_id!: number;
  public role_name!: string;
}

roleModel.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING(100), // Set max length explicitly
      allowNull: false,
      unique: true, // This is fine, only 1 unique key
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['role_name'], // ensures one clean unique index
      },
    ],
  }
);

export default roleModel;
