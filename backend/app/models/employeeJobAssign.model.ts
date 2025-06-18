import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const employeeJobModel = sequelize.define(
  "employee_job",
  {
    emp_job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "employee",
        key: "emp_id",
      },
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "job",
        key: "job_id",
      },
    },
  },
  {
    tableName: "employeeJob",
    timestamps: true,
  }
);

export default employeeJobModel;
