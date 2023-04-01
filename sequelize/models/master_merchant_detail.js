const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('master_merchant_detail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    merchant_id: {
      allowNull: false,
      type: DataTypes.INTEGER(30)
    },
    register_business_country: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    type_of_business: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    is_business_register_in_free_zone: {
      allowNull: false,
      type: DataTypes.INTEGER(1)
    },
    company_name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    company_registration_number: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    vat_number: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    doing_business_as: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    register_business_address_country: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    address_line1: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    address_line2: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    province: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    business_phone_number: {
      allowNull: false,
      type: DataTypes.STRING(15)
    },
    business_phone_code: {
      allowNull: false,
      type: DataTypes.STRING(6)
    },
    mcc_codes: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    psp_id: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    business_website: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    product_description: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    legal_person_first_name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    legal_person_last_name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    legal_person_email: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    job_title: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    nationality: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    dob: {
      allowNull: false,
      type: DataTypes.DATE
    },
    home_address_country: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    home_address_line_1: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    home_address_line_2: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    home_province: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    home_phone_code: {
      allowNull: false,
      type: DataTypes.STRING(6)
    },
    home_phone_number: {
      allowNull: false,
      type: DataTypes.STRING(15)
    },
    personal_id_number: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    statement_descriptor: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    shortened_descriptor: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    customer_support_phone_code: {
      allowNull: false,
      type: DataTypes.STRING(3)
    },
    customer_support_phone_number: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    iban: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    bank_document_type: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    bank_currency: {
      allowNull: false,
      type: DataTypes.STRING(3)
    },
    bank_country: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    bank_document: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    bank_name: {
      allowNull: false,
      type: DataTypes.STRING(200)
    },
    ifsc: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    branch_name: {
      allowNull: false,
      type: DataTypes.STRING(200)
    },
    last_updated: {
      allowNull: false,
      type: DataTypes.DATE
    },
    poc_name: {
      allowNull: false,
      type: DataTypes.STRING(200)
    },
    poc_email: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    poc_mobile_code: {
      allowNull: false,
      type: DataTypes.STRING(3)
    },
    poc_mobile: {
      allowNull: false,
      type: DataTypes.STRING(15)
    },
    cro_name: {
      allowNull: false,
      type: DataTypes.STRING(200)
    },
    cro_email: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    cro_mobile_code: {
      allowNull: false,
      type: DataTypes.STRING(3)
    },
    cro_mobile: {
      allowNull: false,
      type: DataTypes.STRING(15)
    },
    co_name: {
      allowNull: false,
      type: DataTypes.STRING(200)
    },
    co_email: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    co_mobile_code: {
      allowNull: false,
      type: DataTypes.STRING(3)
    },
    co_mobile: {
      allowNull: false,
      type: DataTypes.STRING(15)
    },
    link_tc: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    link_pp: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    link_refund: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    link_cancellation: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    link_delivery_policy: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    max_per_txn_limit:{
      allowNull: true,
      type: DataTypes.FLOAT(10,2)
    },
    high_risk_txn_limit:{
      allowNull: true,
      type: DataTypes.FLOAT(10,2)
    },
    transaction_currencies:{
      allowNull: true,
      type: DataTypes.STRING(255)
    }

  }, {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    modelName: "master_merchant_detail",
    tableName: "pg_master_merchant_details"
  });
}


