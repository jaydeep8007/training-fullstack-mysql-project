import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize"; // adjust this path as needed

const subscriptionModel = sequelize.define("subscription", {
  subscription_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subscription_plan_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription_plan_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription_provider_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription_provider: {
    type: DataTypes.ENUM("stripe", "paypal"),
    allowNull: false,
  },
  subscription_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subscription_currency: {
    type: DataTypes.STRING,
    defaultValue: "USD",
  },
  subscription_status: {
    type: DataTypes.ENUM("active", "trialing", "cancelled", "past_due"),
    allowNull: false,
  },
  subscription_start_date: {
    type: DataTypes.DATE,
  },
  subscription_end_date: {
    type: DataTypes.DATE,
  },
  subscription_trial_end: {
    type: DataTypes.DATE,
  },
  subscription_is_cancelled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  subscription_cancel_at_period_end: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
  tableName: "subscriptions", // optional: plural name in DB
});

// In models/subscription.model.ts
import customerModel from "./customer.model"; // adjust path if needed

subscriptionModel.belongsTo(customerModel, {
  foreignKey: "cus_id",
  as: "customer",
});

customerModel.hasMany(subscriptionModel, {
  foreignKey: "cus_id",
  as: "subscriptions",
});


export default subscriptionModel;