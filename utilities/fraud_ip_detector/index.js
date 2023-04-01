var validateIP = require('validate-ip-node');
const ServerResponse = require("../response/ServerResponse");
const StatusCode = require("../statuscode/index");
var ip = require('ip');
var geoip = require('geoip-country');
const { models } = require('../../sequelize/index');
const order = require('../../sequelize/models/order');
module.exports = async (req, res, next) => {
    let ip = req.headers.ip;
    req.fraud = {
        flags: {
            ip: false,
            email: false,
            limit: false,
            country: false,
            high_volume: false
        },
        remark: {
            ip: '',
            email: '',
            limit: '',
            country: '',
            high_volume: ''
        }
    }
    if (validateIP(ip)) {

        let fraud_details = await models.fraud.findOne({ attributes: ['suspicious_emails', 'suspicious_ips'], where: { id: 1 } });
        let order_email = req.body.data.customer_details.email;
        let suspicious_ip = fraud_details.suspicious_ips.split(',');
        let suspicious_email = fraud_details.suspicious_emails.split(",");
        // for suspicious emails
        if (suspicious_email.includes(order_email)) {
            req.fraud.flags.email = true;
            req.fraud.remark.email == "Transactions block for suspicious email " + order_email;
        }
        //for suspicious ip
        if (suspicious_ip.includes(ip)) {
            req.fraud.flags.ip = true;
            req.fraud.remark.ip == "Transactions block for suspicious ip " + ip;
        }
        // for high risk country
        let high_risk_country_iso2 = await models.country.findAll({attributes:['iso2'],where:{is_high_risk:1}});
        let country_iso = geoip.lookup(ip);
        if (country_iso) {
            let is_high_risk_country = high_risk_country_iso2.find(country => country.iso2 === country_iso.country);
            if (is_high_risk_country) {
                req.fraud.flags.country = true;
                req.fraud.remark.country == "Transactions is from high risk country " + country_iso
            }
        }
        //for transaction limit and risk transaction    
        let transaction_limit_and_currency = await models.master_merchant_detail.findOne({attributes:['transaction_currencies','max_per_txn_limit','high_risk_txn_limit'],where:{id:req.credentials.merchant_id}});
         let transaction_currencies = transaction_limit_and_currency.transaction_currencies.split(',');
         let high_volume = transaction_limit_and_currency.high_risk_txn_limit;
         let transaction_limit = transaction_limit_and_currency.max_per_txn_limit;

         let order_currency = req.body.data.order_details.currency;
         let order_amount = req.body.data.order_details.amount;
         if(transaction_currencies.includes(order_currency)){
            if(transaction_limit<=order_amount){
                req.fraud.flags.limit=true;
                req.fraud.remark.limit='Order amount is greater than allowed';
                
            }
            if(high_volume<=order_amount){
                req.fraud.flags.high_volume=true;
                req.fraud.remark.high_volume='High volume transaction';
            }
         }
        next();
    } else {
        res.status(StatusCode.badRequest)
            .send(ServerResponse.fraudDetectionResponse(`Invalid IP address`));
    }
}
