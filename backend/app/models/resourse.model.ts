// models/Resource.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class resourceModel extends Model {
  resource_id : number
}

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
      unique: false,
    },
  },
  {
    sequelize,
    tableName: 'resources',
    timestamps: false,
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ['resource_name'],
    //     name: 'unique_resource_name', // ✅ Match this name with above
    //   },
    // ],
  }
);

export default resourceModel;
