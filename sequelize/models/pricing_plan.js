const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('pricing_plan', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        from_amount: {
            allowNull: false,
            type: DataTypes.FLOAT(10, 2)
        },
        to_amount: {
            allowNull: false,
            type: DataTypes.FLOAT(10, 2)
        },
        monthly_fee: {
            allowNull: false,
            type: DataTypes.FLOAT(10, 2)
        },
        percentage_value: {
            allowNull: false,
            type: DataTypes.FLOAT(10, 2)
        },
        fixed_amount: {
            allowNull: false,
            type: DataTypes.FLOAT(10, 2)
        },
        added_at: {
            allowNull: false,
            type: DataTypes.DATE
        },
        deleted: {
            allowNull: false,
            type: DataTypes.INTEGER(1)
        },
        feature: {
            allowNull: false,
            type: DataTypes.STRING(100)
        }

    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "pricing_plan",
        tableName: "pg_pricing_plan"
    })
}
