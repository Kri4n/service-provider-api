"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "last_name",
      },
      mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "mobile_number",
        validate: { is: /^[0-9]{10,15}$/ },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "email",
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password_hash",
      },
      roleType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "role_type",
      },
      accountType: {
        type: DataTypes.ENUM("admin", "provider", "customer"),
        allowNull: false,
        field: "account_type",
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false,
    },
  );

  return User;
};
