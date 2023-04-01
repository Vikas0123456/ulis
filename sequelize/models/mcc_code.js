const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('mcc_code', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    mcc_code: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    classification: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    category: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    deleted: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    }
  },{
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    modelName: "mcc_code",
    tableName: "pg_mcc_code"
  })
}


