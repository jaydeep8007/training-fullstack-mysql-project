import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/sequelize";

interface CustomerAttributes {
  cus_id: string;
  cus_firstname: string;
  cus_lastname: string;
  cus_email: string;
  cus_phone_number: string;
  cus_password: string;

  reset_password_token?: string | null;
  reset_password_expires?: Date | null;
  cus_status: "active" | "inactive" | "restricted" | "blocked";
}

type CustomerCreationAttributes = Optional<CustomerAttributes, "cus_id">;

class customerModel
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  public cus_id!: string;
  public cus_firstname!: string;
  public cus_lastname!: string;
  public cus_email!: string;
  public cus_phone_number!: string;
  public cus_password!: string;
  public reset_password_token?: string | null;
  public reset_password_expires?: Date | null;
  public cus_status!: "active" | "inactive" | "restricted" | "blocked";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

customerModel.init(
  {
    cus_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cus_firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "First name must be between 2 and 30 characters",
        },
      },
    },
    cus_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "Last name must be between 2 and 30 characters",
        },
      },
    },
    cus_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    cus_phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cus_password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: "Password must be at least 6 characters long",
        },
      },
    },
    cus_status: {
      type: DataTypes.ENUM("active", "inactive", "restricted", "blocked"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "customer",
    timestamps: true,
    indexes: [
      {
        name: "unique_cus_email",
        unique: true,
        fields: ["cus_email"],
      },
      {
        name: "unique_cus_phone_number",
        unique: true,
        fields: ["cus_phone_number"],
      },
    ],
  }
);

export default customerModel;
