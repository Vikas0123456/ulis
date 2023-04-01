const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('res_dump', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        order_id: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        res_dump:{
            allowNull:false,
            type:DataTypes.TEXT
        }
      
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "res_dump",
        tableName: "pg_txn_res_dump"
    })
}
