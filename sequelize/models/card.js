const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('card', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        browser_token: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        name_on_card:{
            allowNull: true,
            type: DataTypes.STRING(100)
        },
        card_number:{
            allowNull: false,
            type: DataTypes.STRING(200)
        },
        card_expiry:{
            allowNull: false,
            type: DataTypes.STRING(10)
        },
        card_nw:{
            allowNull: false,
            type: DataTypes.STRING(20)
        },
        last_4_digit:{
            allowNull: false,
            type: DataTypes.STRING(4)
        },
        cid:{
            allowNull: true,
            type: DataTypes.STRING(200)
        },
        deleted:{
            allowNull: false,
            type: DataTypes.INTEGER(1)
        },
        status:{
            allowNull: false,
            type: DataTypes.INTEGER(1)
        },
        primary_card:{
            allowNull: true,
            type: DataTypes.INTEGER(1)
        },
        created_at:{
            allowNull: false,
            type: DataTypes.DATE
        },
        updated_at:{
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "card",
        tableName: "pg_customers_cards"
    });
}  