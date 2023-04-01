const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('master_super_merchant', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      allowNull: false,
      defaultValue: "",
      type: DataTypes.STRING(255)
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING(7)
    },
    mobile_no: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    referral_code_used: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    password: {
      allowNull: false,
      defaultValue: "",
      type: DataTypes.STRING(255)
    },
    ip: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    email_verified: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER(1)
    },
    mobile_no_verified: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER(1)
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER(1)
    },
    deleted: {
      allowNull: false,
      type: DataTypes.INTEGER(1)
    },
    auth_2fa_token: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    language: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER(11)
    },
    theme: {
      allowNull: false,
      defaultValue: "light-layout",
      type: DataTypes.ENUM("light-layout", "dark-layout")
    },
    register_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
    {
      sequelize,
      freezeTableName: true,
      createdAt: false,
      updatedAt: false,
      modelName: "master_super_merchant",
      tableName: "pg_master_super_merchant"
    })
}

