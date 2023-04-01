const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('order_txn_test', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        order_id: {
            allowNull: false,
            type: DataTypes.STRING(15)
        },
        txn: {
            allowNull: false,
            type: DataTypes.STRING(15)
        },
        status: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        amount: {
            allowNull: false,
            type: DataTypes.FLOAT
        },
        currency: {
            allowNull: false,
            type: DataTypes.STRING(3)
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "order_txn_test",
        tableName: "pg_order_txn_test"
    });
}  