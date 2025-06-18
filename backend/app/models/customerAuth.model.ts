import sequelize from "../config/sequelize";
import { DataTypes } from "sequelize";

const customerAuthModel = sequelize.define(
  "customerAuth",
  {
    cus_auth_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customer",
        key: "cus_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    cus_auth_token: {
      type: DataTypes.STRING,
      allowNull: true, // can be null or empty
      defaultValue: "", // default to empty string if not provided
    },
    cus_auth_refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
   
    },
  },
  {
    timestamps: true,
    collate: "utf8_general_ci",
    indexes: [
      {
        name: "unique_refresh_token",
        unique: true,
        fields: ["cus_auth_refresh_token"],
      },
    ],
  }
);

export default customerAuthModel;
