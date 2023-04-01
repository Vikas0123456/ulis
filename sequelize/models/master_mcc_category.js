const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('master_mcc_category', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    mcc_category: {
      allowNull: false,
      type: DataTypes.INTEGER(30)
    },
    deleted: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    added_date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    added_time: {
      allowNull: false,
      type: DataTypes.TIME
    },
    ip: {
      allowNull: false,
      type: DataTypes.STRING(20)
    }
  }, {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    modelName: "master_mcc_category",
    tableName: "pg_master_mcc_category"
  })
}
