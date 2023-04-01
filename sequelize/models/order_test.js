const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('order_test', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    merchant_id: {
      allowNull: false,
      type: DataTypes.INTEGER(10)
    },
    order_id: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    payment_id: {
      allowNull: true,
      type: DataTypes.STRING(50)
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    customer_name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    customer_email: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    customer_mobile: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    billing_address_line_1: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    billing_address_line_2: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    billing_city: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    billing_pincode: {
      allowNull: true,
      type: DataTypes.STRING(10)
    },
    billing_province: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    billing_country: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    shipping_address_line_1: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    shipping_address_line_2: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    shipping_city: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    shipping_country: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    shipping_province: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    shipping_pincode: {
      allowNull: true,
      type: DataTypes.STRING(10)
    },
    amount: {
      allowNull: false,
      type: DataTypes.FLOAT(10, 2)
    },
    currency: {
      allowNull: false,
      type: DataTypes.STRING(5)
    },
    return_url: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    card_no: {
      allowNull: true,
      type: DataTypes.STRING(4)
    },
    browser: {
      allowNull: true,
      type: DataTypes.STRING(50)
    },
    ip: {
      allowNull: true,
      type: DataTypes.STRING(20)
    },
    os: {
      allowNull: true,
      type: DataTypes.STRING(50)
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    super_merchant: {
      allowNull: true,
      type: DataTypes.INTEGER(11)
    },
    cid: {
      allowNull: true,
      type: DataTypes.STRING(200)
    },
    block_for_suspicious_ip: {
      allowNull: true,
      type: DataTypes.INTEGER(1),
      defaultValue: 0
    },
    block_for_suspicious_email: {
      allowNull: true,
      type: DataTypes.INTEGER(1),
      defaultValue: 0
    },
    high_risk_country: {
      allowNull: true,
      type: DataTypes.INTEGER(1),
      defaultValue: 0
    },
    block_for_transaction_limit: {
      allowNull: true,
      type: DataTypes.INTEGER(1),
      defaultValue: 0
    },
    high_risk_transaction: {
      allowNull: true,
      type: DataTypes.INTEGER(1),
      defaultValue: 0
    },
    remark: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },
    payment_mode: {
      allowNull: true,
      type: DataTypes.STRING(255)
    },
    sale_charge: {
      allowNull: true,
      type: DataTypes.FLOAT(10, 2)
    },
    sale_tax: {
      allowNull: true,
      type: DataTypes.FLOAT(10, 2)
    },
    buy_charge: {
      allowNull: true,
      type: DataTypes.FLOAT(10, 2)
    },
    buy_tax: {
      allowNull: true,
      type: DataTypes.FLOAT(10, 2)
    },
    mcc_category: {
      allowNull: true,
      type: DataTypes.INTEGER(11)
    },
    mcc: {
      allowNull: true,
      type: DataTypes.INTEGER(11)
    },
    refund_response_dump:{
      allowNull: true,
      type: DataTypes.TEXT()
    }
  }, {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    tableName: "pg_orders_test",
    modelName: "order_test"
  })
}

