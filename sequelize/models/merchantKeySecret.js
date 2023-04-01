const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('merchant_key_and_secret', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    merchant_id: {
      allowNull: false,
      type: DataTypes.INTEGER(30)
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM("test", "live")
    },
    merchant_key: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    merchant_secret: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    modelName: "merchant_key_and_secret",
    tableName: "pg_master_merchant_key_and_secret"
  })
}

