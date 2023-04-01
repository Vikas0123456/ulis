const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('title', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
      
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "title",
        tableName: "pg_title"
    })
}
