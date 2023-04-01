const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('master_merchant', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    super_merchant_id: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    transaction_setup_id: {
      allowNull: false,
      type: DataTypes.INTEGER(12)
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING(7)
    },
    mobile_no: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    password: {
      allowNull: false,
      defaultValue: "",
      type: DataTypes.STRING(255)
    },
    ip: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },
    email_verified: {
      allowNull: false,
      type: DataTypes.INTEGER(1),
      defaultValue: 1
    },
    mobile_no_verified: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER(1)
    },
    live: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER(1)
    },
    deleted: {
      allowNull: false,
      type: DataTypes.INTEGER(1)
    },
    mode: {
      allowNull: false,
      type: DataTypes.ENUM("test", "live")
    },
    onboarding_done: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    video_kyc_done: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    ekyc_done: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER(1)
    },
    ekyc_required: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    main_step: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER(1)
    },
    sub_step: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER(1)
    },
    step_completed: {
      allowNull: false,
      type: DataTypes.INTEGER(30)
    },
    auth_2fa_token: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    language: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    theme: {
      allowNull: false,
      defaultValue: "light-layout",
      type: DataTypes.ENUM("light-layout", "dark-layout")
    },
    icon: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    logo: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    use_logo: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    default_language: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    we_accept_image: {
      allowNull: false,
      type: DataTypes.STRING(250)
    },
    brand_color: {
      allowNull: false,
      defaultValue: "#4c64e6",
      type: DataTypes.STRING(50)
    },
    accent_color: {
      allowNull: false,
      defaultValue: "#4c64e6",
      type: DataTypes.STRING(50)
    },
    referral_code: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    referral_code_used: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    register_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    psp_mail_send: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    branding_language: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    }
  }, {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    modelName: "master_merchant",
    tableName: "pg_master_merchant"
  })
}