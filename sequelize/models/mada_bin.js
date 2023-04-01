const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('mada_bin', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        member_bank: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        acq:{
            allowNull: false,
            type: DataTypes.INTEGER(10)
        },
        issuer_id:{
            allowNull: false,
            type: DataTypes.INTEGER(6)
        },
        bin:{
            allowNull: false,
            type: DataTypes.INTEGER(6)
        },
        pan_length:{
            allowNull: false,
            type: DataTypes.INTEGER(11)
        },
        co_brand:{
            allowNull: false,
            type: DataTypes.STRING(20)
        }
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "mada_bin",
        tableName: "pg_mada_bin"
    });
}  