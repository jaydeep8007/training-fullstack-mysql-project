import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const jobModel = sequelize.define(
  "job",
  {
    job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_name: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    job_sku: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    job_category: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    tableName: "job",
    timestamps: true,
    collate: "utf8_general_ci",
  }
);

export default jobModel;
