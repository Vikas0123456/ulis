const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('fraud', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        suspicious_emails: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        suspicious_ips:{
            allowNull: false,
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "fraud",
        tableName: "pg_fraud_detections"
    });
}  