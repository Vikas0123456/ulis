function applyExtraSetup(sequelize) {
	const { order, merchant_key_and_secret, master_mcc_category, master_merchant_detail, master_merchant, master_super_merchant, mcc_code, order_test, mada_bin, order_txn, order_txn_test,card,fraud,country,mid,pricing_plan } = sequelize.models;
	mcc_code.hasMany(master_mcc_category);
	//order and merchant relation
	master_merchant.hasMany(order, {
		as: 'order',
		foreignKey: 'merchant_id'
	});
	order.belongsTo(master_merchant,
		{ as: 'merchant', foreignKey: { name: 'merchant_id', allowNull: false } });
	master_merchant_detail.hasMany(order, {
		as: 'order',
		foreignKey: 'merchant_id'
	});
	order.belongsTo(master_merchant_detail,
		{ as: 'merchant_details', foreignKey: { name: 'merchant_id', allowNull: false } }
	);
	order.hasMany(order_txn,{
		as:'order_txn',
		foreignKey:'order_id'
	});
	order_txn.belongsTo(order,{as:'order_txn',foreignKey:{name:'order_id',allowNull:false}});





}

module.exports = { applyExtraSetup };