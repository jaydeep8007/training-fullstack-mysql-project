// models/Permission.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import roleModel from './role.model';
import resourceModel from './resourse.model';
class permissionModel extends Model {}

permissionModel.init(
  {
    permission_id: {
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
    can_create: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_update: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_delete: {
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
permissionModel.belongsTo(roleModel, { foreignKey: 'role_id', as: 'roles' });
permissionModel.belongsTo(resourceModel, { foreignKey: 'resource_id', as: 'resource' });

roleModel.hasMany(permissionModel, { foreignKey: 'role_id', as: 'permissions' });
resourceModel.hasMany(permissionModel, { foreignKey: 'resource_id', as: 'permissions' });

export default permissionModel;
