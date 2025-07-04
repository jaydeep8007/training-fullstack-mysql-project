import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

interface AdminAttributes {
  admin_id: string;
  admin_firstname: string;
  admin_lastname: string;
  admin_email: string;
  admin_phone_number: string;
  admin_password: string;
 
}

type AdminCreationAttributes = Optional<AdminAttributes, 'admin_id'>;

class adminModel
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  public admin_id!: string;
  public admin_firstname!: string;
  public admin_lastname!: string;
  public admin_email!: string;
  public admin_phone_number!: string;
  public admin_password!: string;


  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

adminModel.init(
  {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: 'First name must be between 2 and 30 characters',
        },
      },
    },
    admin_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: 'Last name must be between 2 and 30 characters',
        },
      },
    },
    admin_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: 'Password must be at least 6 characters long',
        },
      },
    },
  
  },
  {
    sequelize,
    tableName: 'admin',
    timestamps: true,
    indexes: [
      {
        name: 'unique_admin_email',
        unique: true,
        fields: ['admin_email'],
      },
      {
        name: 'unique_admin_phone_number',
        unique: true,
        fields: ['admin_phone_number'],
      },
    ],
  }
);

export default adminModel;
