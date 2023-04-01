const express = require("express");
const app = express();
/** Validator Import **********************************************************************************/ 
const orderValidator = require('../../../utilities/validations/order');
const lookupValidatior = require('../../../utilities/validations/lookupvalidation');
/** Validator Import Ends *****************************************************************************/ 
/** Controller Import**********************************************************************************/ 
const Order = require('../../../controllers/order.controller');
const lookup = require('../../../controllers/lookup.controller');
/** Controller Import Ends*/ 
/** Helpers and Utilities Import **********************************************************************/ 
const helpers = require('../../../helpers/index');
const CheckMerchantCred = require('../../../utilities/prechecks/checkMerchantCred');
const fraud_detections = require('../../../utilities/fraud_ip_detector/index');

/** End Section ***************************************************************************************/ 

// const Orders = require('../../../controllers/orders.controller');
// const ordersValidator = require('../../../utilities/validations/orders');
// const order = require("../../../sequelize/models/order");


app.post('/orders/create',CheckMerchantCred,helpers.checkHeader,orderValidator.create,fraud_detections,Order.create);
app.post('/orders/fraud-check',helpers.checkHeader,Order.fraudCheck);
app.post('/orders/details',helpers.checkHeader,helpers.orderToken,orderValidator.details,Order.details)
app.post('/orders/transaction-details',helpers.checkHeader,orderValidator.transaction_details,Order.details_with_transaction)
app.post('/orders/transaction-details-print',helpers.checkHeader,orderValidator.transaction_details,Order.details_with_transaction_print)
app.post('/orders/pay',helpers.checkHeader,helpers.orderToken,orderValidator.pay,Order.saveCardPay,Order.pay);
app.post('/orders/pay-3ds',helpers.checkHeader,Order.saveCard,Order.pay_3ds);
app.post('/orders/cancel',helpers.checkHeader,helpers.orderToken,orderValidator.update,Order.cancel);
app.post('/orders/failed',helpers.checkHeader,helpers.orderToken,orderValidator.update,Order.failed);

app.post('/lookup/bin',helpers.checkHeader,lookupValidatior.bin,lookup.bin);
app.post('/lookup/ip',helpers.checkHeader,lookupValidatior.ip,lookup.ip);

app.post('/orders/refund',helpers.checkHeader,orderValidator.refund,Order.refund);
app.post('/orders/void',helpers.checkHeader,orderValidator.void_transaction,Order.void_transaction)



// app.post('/orders/auth',CheckMerchantCred,helpers.checkHeader,ordersValidator.create,Orders.create);
app.post('/orders/card-list',helpers.checkHeader,Order.cardList);
app.post('/orders/card/delete',helpers.checkHeader,orderValidator.card_delete,Order.card_delete);
app.post('/orders/card/details',helpers.checkHeader,orderValidator.card_details,Order.card_details);

app.post('/orders/dummy-rate',Order.chargeCalculate);


module.exports = app;