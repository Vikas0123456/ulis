const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('country', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        country_name: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        country_code:{
            allowNull: false,
            type: DataTypes.STRING(3)
        },
        mobile_no_length:{
            allowNull: false,
            type: DataTypes.INTEGER(11)
        },
        numeric_code:{
            allowNull: false,
            type: DataTypes.STRING(3)
        },
        iso2:{
            allowNull: true,
            type: DataTypes.STRING(2)
        },
        dial:{
            allowNull: true,
            type: DataTypes.STRING(255)
        },
        capital:{
            allowNull: true,
            type: DataTypes.STRING(255)
        },
        currency:{
            allowNull: true,
            type: DataTypes.STRING(255)
        },
        currency_name:{
            allowNull: true,
            type: DataTypes.STRING(255)
        },
        currency_symbol:{
            allowNull: true,
            type: DataTypes.STRING
        },
        tld:{
            allowNull: true,
            type: DataTypes.STRING
        },
        native:{
            allowNull: true,
            type: DataTypes.STRING
        },
        region:{
            allowNull: true,
            type: DataTypes.STRING
        },
        subregion:{
            allowNull: true,
            type: DataTypes.STRING
        },
        timezones:{
            allowNull: true,
            type: DataTypes.TEXT
        },
        translations:{
            allowNull: true,
            type: DataTypes.TEXT
        },
        latitude:{
            allowNull: true,
            type: DataTypes.DECIMAL(10,8)
        },
        longitude:{
            allowNull: true,
            type: DataTypes.DECIMAL(10,8)
        },
        emoji:{
            allowNull: true,
            type: DataTypes.STRING(191)
        },
        emojiU:{
            allowNull: true,
            type: DataTypes.STRING(191)
        },
        created_at:{
            allowNull: false,
            type: DataTypes.DATE
        },
        updated_at:{
            allowNull: false,
            type: DataTypes.DATE
        },
        flag:{
            allowNull: true,
            type: DataTypes.INTEGER(1)
        },
        wikiDataId:{
            allowNull: true,
            type: DataTypes.STRING(255)
        },
        is_high_risk:{
            allowNull: false,
            type: DataTypes.INTEGER(1)
        },
        is_this_country_zone:{
            allowNull: true,
            type: DataTypes.INTEGER(11)
        },
        status:{
            allowNull: true,
            type: DataTypes.INTEGER(1)
        },
        deleted:{
            allowNull: true,
            type: DataTypes.INTEGER(1)
        },
        ip:{
            allowNull: true,
            type: DataTypes.STRING(20)
        }
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "country",
        tableName: "pg_country"
    });
}  