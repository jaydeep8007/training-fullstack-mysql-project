import sequelize from '../config/sequelize';

import jobModel from './job.model';
import employeeModel from './employee.model';
import employeeJobModel from './employeeJobAssign.model';
import customerModel from './customer.model';
import customerAuthModel from './customerAuth.model';
// import globalConfigModel from './globalConfig.model';
import adminModel from './admin.model';
import roleModel from './role.model';
import permissionModel from './permission.model';
import adminAuthModel from './adminAuth.model';
// import rolePermissionModel from './rolePermission.model';



// Associations

// 4. Admin and AdminAuth (One-to-One)
adminModel.hasOne(adminAuthModel, {
  foreignKey: 'admin_id',
  as: 'auth',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

adminAuthModel.belongsTo(adminModel, {
  foreignKey: 'admin_id',
  as: 'admin',
});

// 1. Customer and CustomerAuth (One-to-One)
customerModel.hasOne(customerAuthModel, {
  foreignKey: 'cus_id',
  as: 'auth',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
customerAuthModel.belongsTo(customerModel, {
  foreignKey: 'cus_id',
  as: 'customer',
});

// 2. Employee and Job (Many-to-One)
employeeModel.belongsTo(jobModel, {
  foreignKey: 'job_id',
  as: 'job',
});
jobModel.hasMany(employeeModel, {
  foreignKey: 'job_id',
  as: 'employee',
});

// 3. Employee and Customer (Many Employees per Customer)
customerModel.hasMany(employeeModel, {
  foreignKey: 'cus_id',
  as: 'employee',
});
employeeModel.belongsTo(customerModel, {
  foreignKey: 'cus_id',
  as: 'customer',
});

// ✅ Admin belongs to Role
adminModel.belongsTo(roleModel, {
  foreignKey: 'role_id',
  as: 'roles',
});

roleModel.hasMany(adminModel, {
  foreignKey: 'role_id',
  as: 'admin',
});




export default {
  sequelize,
  employeeModel,
  jobModel,
  employeeJobModel,
  customerModel,
  customerAuthModel,
roleModel,
// rolePermissionModel,
permissionModel
};
