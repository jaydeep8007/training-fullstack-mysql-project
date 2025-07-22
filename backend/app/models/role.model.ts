import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class roleModel extends Model {
  public role_id!: number;
  public role_name!: string;
  public role_status!: 'active' | 'inactive';
}

roleModel.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false, // ✅ Only this is needed
    },
    // role_slug:{
    //   type:DataTypes.STRING,
    //   allowNull:false,
    //   unique: true,
    // },
     role_status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
// indexes: [
//       {
//         unique: true,
//         fields: ['role_name'],
//         name: 'unique_role_name', // ✅ Must match the name used in the column definition
//       },
//     ],
  }
);

export default roleModel;