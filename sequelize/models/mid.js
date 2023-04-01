const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('mid', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        submerchant_id: {
            allowNull: false,
            type: DataTypes.INTEGER(11)
        },
        psp_id:{
            allowNull: true,
            type: DataTypes.INTEGER(11)
        },
        MID:{
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        class:{
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        auth_currency:{
            allowNull: false,
            type: DataTypes.STRING(10)
        },
        settlement_currency:{
            allowNull: false,
            type: DataTypes.STRING(10)
        },
        status:{
            allowNull: true,
            type: DataTypes.STRING(20)
        },
        protocol:{
            allowNull: false,
            type: DataTypes.STRING(20)
        },
        threeds:{
            allowNull: false,
            type: DataTypes.INTEGER(11)
        },
        password:{
            allowNull: true,
            type: DataTypes.STRING(100)
        },
        mode:{
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        cvv_setting:{
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        class_setting:{
            allowNull:true,
            type:DataTypes.STRING(50)
        },
        buy_percentage:{
            allowNull:false,
            type:DataTypes.FLOAT(10,2)
        },
        buy_fixed:{
            allowNull:false,
            type:DataTypes.FLOAT(10,2)
        },
        sell_percentage:{
            allowNull:false,
            type:DataTypes.FLOAT(10,2)
        },
        sell_fixed:{
            allowNull:false,
            type:DataTypes.FLOAT(10,2)
        },
        payout_delay:{
            allowNull:false,
            type:DataTypes.INTEGER(11)
        },
        currency:{
            allowNull:false,
            type:DataTypes.STRING(10)
        },
        deleted:{
            allowNull:false,
            type:DataTypes.INTEGER(11)
        },
        added_at:{
            allowNull:false,
            type:DataTypes.DATE
        }
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "mid",
        tableName: "pg_mid"
    });
}  