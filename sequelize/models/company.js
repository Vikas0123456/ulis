const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define('company', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        partner_id: {
            allowNull: false,
            type: DataTypes.INTEGER(30)
        },
        company_name: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        company_logo: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        company_address:{
            allowNull: false,
            type: DataTypes.STRING(255)
        },
        company_country:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_city:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_state:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_pincode:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_contact:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        country_code:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_organizer:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_currency:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fav_icon:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        letter_head:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        footer_banner:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        added_date:{
            type: DataTypes.DATE,
            allowNull: false, 
        },
        deleted:{
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        ip:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        batch_size:{
            type: DataTypes.INTEGER,
            allowNull: false,  
        },
        default_logout_time:{
            type: DataTypes.INTEGER,
            allowNull: false,  
        },
        android_link:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        ios_link:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        smtp_name:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        smtp_port:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        smtp_username:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        smtp_password:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        smtp_from:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        smtp_fn:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        smtp_tls:{
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        smtp_reply:{
            type: DataTypes.STRING,
            allowNull: false, 
        }
    }, {
        sequelize,
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        modelName: "company",
        tableName: "pg_company_master"
    })
}
