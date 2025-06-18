import sequelize from "../config/sequelize";

import jobModel from "./job.model";
import employeeModel from "./employee.model";
import employeeJobModel from "./employeeJobAssign.model";
import customerModel from "./customer.model";
import customerAuthModel from "./customerAuth.model";

// Associations

// 1. Customer and CustomerAuth (One-to-One)
customerModel.hasOne(customerAuthModel, {
  foreignKey: "cus_id",
  as: "auth",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
customerAuthModel.belongsTo(customerModel, {
  foreignKey: "cus_id",
  as: "customer",
});

// 2. Employee and Job (Many-to-One)
employeeModel.belongsTo(jobModel, {
  foreignKey: "job_id",
  as: "job",
});
jobModel.hasMany(employeeModel, {
  foreignKey: "job_id",
  as: "employee",
});

// 3. Employee and Customer (Many Employees per Customer)
customerModel.hasMany(employeeModel, {
  foreignKey: "cus_id",
  as: "employee",
});
employeeModel.belongsTo(customerModel, {
  foreignKey: "cus_id",
  as: "customer",
});

export default {
  sequelize,
  employeeModel,
  jobModel,
  employeeJobModel,
  customerModel,
  customerAuthModel,
};
