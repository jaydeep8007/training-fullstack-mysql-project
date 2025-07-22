// models/Permission.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import roleModel from './role.model';
import resourceModel from './resourse.model';
class adminPermissionModel extends Model {
   admin_permission_id?: number;
  role_id: number;
  resource_id: number;
  admin_permission_can_create?: boolean;
  admin_permission_can_read?: boolean;
  admin_permission_can_update?: boolean;
  admin_permission_can_delete?: boolean;
}

adminPermissionModel.init(
  {
    admin_permission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: roleModel,
        key: 'role_id',
      },
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: resourceModel,
        key: 'resource_id',
      },
    },
    admin_permission_can_create: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    admin_permission_can_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    admin_permission_can_update: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    admin_permission_can_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'permissions',
    timestamps: false,
  }
);

// Define associations
adminPermissionModel.belongsTo(roleModel, { foreignKey: 'role_id', as: 'roles' });
adminPermissionModel.belongsTo(resourceModel, { foreignKey: 'resource_id', as: 'resource' });

roleModel.hasMany(adminPermissionModel, { foreignKey: 'role_id', as: 'permissions' });
resourceModel.hasMany(adminPermissionModel, { foreignKey: 'resource_id', as: 'permissions' });

export default adminPermissionModel;
