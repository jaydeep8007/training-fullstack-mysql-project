// import { DataTypes } from "sequelize";
// import sequelize from "../config/sequelize";

// const employeeModel = sequelize.define(
//   "employee",
//   {
//     emp_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     emp_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     emp_email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: {
//         name: "unique_email",
//         msg: "Email address already in use",
//       },
//     },
//     emp_password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     emp_company_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     emp_mobile_number: {
//       type: DataTypes.BIGINT,
//       allowNull: false,
//     },
//     // cus_id: add this as foreign key
//   },
//   {
//     tableName: "employee",
//     timestamps: true,
//     collate: "utf8_general_ci",
//   }
// );

// export default employeeModel;

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const employeeModel = sequelize.define(
  "employee",
  {
    emp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    emp_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emp_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_email",
        msg: "Email address already in use",
      },
    },
    emp_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emp_company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emp_mobile_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    cus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customer", // 👈 referenced table name (should match DB table name)
        key: "cus_id", // 👈 referenced column
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "employee",
    timestamps: true,
    collate: "utf8_general_ci",
  }
);

export default employeeModel;
