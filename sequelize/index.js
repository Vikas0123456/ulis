const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./relation-manager');
const sequelize = require('./../config/sequelize');

const modelDefiners = [
	require('./models/order'),
	require('./models/merchantKeySecret'),
	require('./models/master_mcc_category'),
	require('./models/master_merchant'),
	require('./models/master_merchant_detail'),
	require('./models/master_super_merchant'),
	require('./models/mcc_code'),
	require('./models/company'),
	require('./models/mada_bin'),
	require('./models/order_txn'),
	require('./models/title'),
	require('./models/res_dump'),
	require('./models/card'),
	require('./models/country'),
	require('./models/fraud'),
	require('./models/mid'),
	require('./models/pricing_plan')

];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

module.exports = sequelize;