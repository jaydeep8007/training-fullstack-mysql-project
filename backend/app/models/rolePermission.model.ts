// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/sequelize';

// class rolePermissionModel extends Model {
//   public role_permission_id!: number;
//   public role_id!: number;
//   public permission_id!: number;
// }

// rolePermissionModel.init(
//   {
//     role_permission_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     role_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'roles',
//         key: 'role_id',
//       },
//     },
//     permission_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'permissions',
//         key: 'permission_id',
//       },
//     },
//   },
//   {
//     sequelize,
//     tableName: 'rolePermissions',
//     timestamps: false,
//   }
// );

// export default rolePermissionModel;
