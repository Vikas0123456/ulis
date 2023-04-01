const jwt = require('jsonwebtoken');
const { models } = require('../sequelize/index');
const helpers = require('../helpers/index');
const statusCode = require('../utilities/statuscode/index');
const response = require('../utilities/response/ServerResponse');
const master_merchant_detail = require('../sequelize/models/master_merchant_detail');
const axios = require('axios');
const { mode } = require('crypto-js');
const order = require('../sequelize/models/order');
const moment = require('moment');
const EventEmitter = require('events');
const ee = new EventEmitter();
const mailSender = require('../utilities/mail/mailsender');
var md5 = require('md5');
const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize');
const op = Sequelize.Op;
var Order = {
  create: async (req, res) => {
    try {
      let client = {
        os: req.headers.os,
        browser: req.headers.browser ? req.headers.browser : '',
        ip: req.headers.ip ? req.headers.ip : ''
      }
      let created_at = new Date().toJSON().substring(0, 19).replace('T', ' ');
      let updated_at = new Date().toJSON().substring(0, 19).replace('T', ' ');
      let customer_details = req.body.data.customer_details;
      let order_details = req.body.data.order_details;
      let billing_details = req.body.data.billing_details;
      let shipping_details = req.body.data.shipping_details;
      let status = 'PENDING'
      let txn = helpers.make_random_key('TXN');
      let token_payload = {
        order_id: order_details.order_id,
        amount: order_details.amount,
        currency: order_details.currency,
        return_url: order_details.return_url,
        env: req.credentials.type,
        merchant_id: req.credentials.merchant_id,
      }

      let ins_body = {
        merchant_id: req.credentials.merchant_id,
        mcc: req.credentials.mcc_id,
        mcc_category: req.credentials.mcc_cat_id,
        super_merchant: req.credentials.super_merchant_id,
        customer_name: customer_details.name,
        customer_email: customer_details.email,
        customer_mobile: customer_details.mobile,
        billing_address_line_1: billing_details.address_line1,
        billing_address_line_2: billing_details.address_line2,
        billing_city: billing_details.city,
        billing_pincode: billing_details.pin,
        billing_province: billing_details.province,
        billing_country: billing_details.country,
        shipping_address_line_1: shipping_details.address_line1,
        shipping_address_line_2: shipping_details.address_line2,
        shipping_city: shipping_details.city,
        shipping_country: shipping_details.country,
        shipping_province: shipping_details.province,
        shipping_pincode: shipping_details.pin,
        amount: order_details.amount,
        currency: order_details.currency,
        return_url: order_details.return_url,
        status: status,
        order_id: order_details.order_id,
        payment_id: txn,
        browser: client.browser,
        ip: client.ip,
        os: client.os,
        created_at: created_at,
        updated_at: updated_at,
        super_merchant: req.credentials.super_merchant,
        block_for_suspicious_ip: req.fraud.flags.ip ? 1 : 0,
        block_for_suspicious_email: req.fraud.flags.email ? 1 : 0,
        high_risk_country: req.fraud.flags.country ? 1 : 0,
        block_for_transaction_limit: req.fraud.flags.limit ? 1 : 0,
        high_risk_transaction: req.fraud.flags.high_volume ? 1 : 0
      }
      models.order.create(ins_body).then((result) => {
        let token = helpers.generateAccessToken(token_payload)
        let res_order_details = {
          status: status,
          message: "Order created",
          token: token,
          order_id: order_details.order_id,
          amount: order_details.currency + ' ' + order_details.amount,
          payment_link: process.env.PAYMENT_URL + 'initiate/' + order_details.order_id.toUpperCase() + '/' + token,
          iframe_link:process.env.PAYMENT_URL + 'initiate/' + order_details.order_id.toUpperCase() + '/' + token+'?origin=iframe',
        }
        res.status(statusCode.ok).send(res_order_details);
      }).catch((error) => {
        res.status(statusCode.internalError).send(response.errormsg(error.message));
      })

    } catch (error) {
      res.status(statusCode.internalError).send(response.errormsg(error.message));
    }
  },
  details: async (req, res) => {
    try {
      models.order.findOne({ where: { order_id: req.body.order_id }, include: [{ model: models.master_merchant, as: 'merchant' }] }).then(async (result) => {
        let merchant_details = await models.master_merchant_detail.findOne({ where: { merchant_id: result.merchant.id } });
        let super_merchant_details = await models.master_super_merchant.findOne({ where: { id: result.merchant.super_merchant_id } });
        let company = await models.company.findOne({ where: { id: '1' } });
        let details = {
          merchant_details: {
            theme: result.merchant.theme,
            icon: result.merchant.icon ? process.env.STATIC_URL + 'files/' + result.merchant.icon : '',
            logo: result.merchant.logo ? process.env.STATIC_URL + 'files/' + result.merchant.logo : '',
            use_logo: result.merchant.use_logo ? process.env.STATIC_URL + 'files/' + result.merchant.use_logo : '',
            we_accept_image: result.merchant.we_accept_image ? process.env.STATIC_URL + 'files/' + result.merchant.we_accept_image : '',
            brand_color: result.merchant.brand_color,
            accent_color: result.merchant.accent_color,
            branding_language: helpers.encrypt(result.merchant.branding_language),
            merchant_name: merchant_details.company_name ? merchant_details.company_name : '',
            company_details: {
              fav_icon: company.fav_icon ? process.env.STATIC_URL + 'images/' + company.fav_icon : '',
              logo: company.logo ? process.env.STATIC_URL + 'images/' + company.logo : '',
              letter_head: company.letter_head ? process.env.STATIC_URL + 'images/' + company.letter_head : '',
              footer_banner: company.footer_banner ? process.env.STATIC_URL + 'images/' + company.footer_banner : '',
              title: company.title ? process.env.STATIC_URL + 'images/' + company.title : '',
            }
          },
          order_details: {
            order_id: result.order_id,
            name: result.customer_name,
            email: result.customer_email,
            mobile_no: result.customer_mobile,
            amount: result.amount.toFixed(2),
            currency: result.currency,
            status: result.status,
            return_url: result.return_url,
            env: req.order.env
          },
          prefer_lang: helpers.encrypt(super_merchant_details.language)
        }
        res.status(statusCode.ok).send(response.successdatamsg(details, 'Details fetch successfully.'));
      }).catch((error) => {
        res.status(statusCode.internalError).send(response.errormsg(error.message));
      })

    } catch (error) {
      res.status(statusCode.internalError).send(response.errormsg(error.message));
    }
  },
  pay: async (req, res) => {
    try {
      models.order.findOne({ where: { order_id: req.body.order_details.order_id }, include: [{ model: models.master_merchant, as: 'merchant' }] }).then(async (result) => {
        let txn = helpers.make_random_key('TXN');
        let username = process.env.MERCHANT_USERNAME + ':' + process.env.MERCHANT_PASSWORD;
        const encodedToken = Buffer.from(username).toString('base64');
        var axios = require('axios');
        var data = JSON.stringify({
          "apiOperation": "PAY",
          "sourceOfFunds": {
            "type": "CARD",
            "provided": {
              "card": {
                "number": req.body.card.number,
                "expiry": {
                  "month": req.body.card.expiry.month,
                  "year": req.body.card.expiry.year
                },
                "securityCode": req.body.card.security_code
              }
            }
          },
          "order": {
            "amount": req.order.amount,
            "currency": req.order.currency
          }
        });

        var config = {
          method: 'put',
          url: process.env.MASTERCARD_TEST_URL + process.env.MERCHANT_KEY + '/order/' + req.order.order_id + '/transaction/' + txn,
          headers: {
            'Authorization': 'Basic ' + encodedToken,
            'Content-Type': 'application/json'
          },
          data: data
        };

        axios(config)
          .then(async (mastercard_response) => {
            console.log(mastercard_response);
            let mastercard_response_data = mastercard_response.data;
            let sourceOfFunds = mastercard_response.data.sourceOfFunds;
            if (mastercard_response_data.response.gatewayCode == 'APPROVED') {
              let updateData = {
                status: 'AUTHORISED',
                payment_id: txn,
                class: 'ECOM',
                payment_mode: sourceOfFunds.provided.card.fundingMethod + ' ' + sourceOfFunds.type,
                card_no: sourceOfFunds.provided.card.number,
                expiry_date: sourceOfFunds.provided.card.expiry.month + '-' + sourceOfFunds.provided.card.expiry.year,
                funding_method: sourceOfFunds.provided.card.fundingMethod,
                card_type: sourceOfFunds.provided.card.fundingMethod,
                card_brand: sourceOfFunds.provided.card.brand
              }
              await models.order.update(updateData, { where: { order_id: req.order.order_id } });
              let order_details = await models.order.findOne({ attributes: ['return_url'], where: { order_id: req.body.order_details.order_id } });
              let api_res = {
                order_status: "AUTHORISED",
                order_id: req.order.order_id,
                payment_id: txn,
                amount: req.order.amount,
                currency: req.order.currency,
                order_details: order_details.return_url,
                browser_fp: req.browser_fp
              }
              await models.order_txn.create({
                order_id: req.order.order_id,
                txn: txn,
                status: 'APPROVED',
                type: mastercard_response_data.transaction.type=='PAYMENT'?'SALE':mastercard_response_data.transaction.type,
                amount: req.order.amount,
                currency: req.order.currency,
                created_at: new Date().toJSON().substring(0, 19).replace('T', ' ')
              });
              await models.res_dump.create({
                order_id: req.order.order_id,
                res_dump: JSON.stringify(mastercard_response_data)
              })
              // Adding event base email sending 
              ee.once('ping', async () => {
                try {
                  //charge calculator
                  let order_id = req.body.order_details.order_id;
                  let amount = req.order.amount;
                  let charge_order_details = await models.order.findOne({ attributes: ['merchant_id'], where: { order_id: order_id } });
                  let mid_details = await models.mid.findOne({ attributes: ['buy_percentage', 'buy_fixed'], where: { submerchant_id: charge_order_details.merchant_id } });
                  const startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD');
                  const endOfMonth = moment().clone().endOf('month').format('YYYY-MM-DD');
                  console.log(startOfMonth);
                  console.log(endOfMonth);
                  let total_details = await models.order.findAll({ attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total_amount']], where: { created_at: { [op.between]: [startOfMonth, endOfMonth] }, merchant_id: charge_order_details.merchant_id, status: ['AUTHORISED'] } });
                  let total = total_details[0].dataValues.total_amount;

                  let plan_details = await models.pricing_plan.findOne({ attributes: ['from_amount', 'to_amount', 'monthly_fee', 'percentage_value', 'fixed_amount'], where: { from_amount: { [op.lte]: total }, to_amount: { [op.gte]: total } } });
                  let buy_percentage = mid_details.buy_percentage;
                  let buy_fixed = mid_details.buy_fixed;
                  let buy_charge = buy_percentage == 0 ? buy_fixed : amount * buy_percentage / 100 + buy_fixed;
                  let sell_charge = plan_details.percentage_value == 0 ? plan_details.fixed_amount : amount * plan_details.percentage_value / 100 + plan_details.fixed_amount;
                  console.log(sell_charge);
                  let settlement_amount = amount - sell_charge;
                  let update_res = await models.order.update({ sale_charge: sell_charge, buy_charge: buy_charge, settlement_amount: settlement_amount }, { where: { order_id: order_id } });
                  //mail sender
                  let order_details = await models.order.findOne({ where: { order_id: req.body.order_details.order_id }, include: [{ model: models.master_merchant, as: 'merchant' }, { model: models.master_merchant_detail, as: 'merchant_details' }] });

                  let mailData = {
                    merchant_email: order_details.merchant.email,
                    company_name: order_details.merchant_details.company_name,
                    logo: order_details.merchant.logo,
                    order_id: order_details.order_id,
                    payment_id: order_details.payment_id,
                    customer_name: order_details.customer_name,
                    customer_email: order_details.customer_email,
                    currency: order_details.currency,
                    amount: order_details.amount,
                    card_no: order_details.card_no,
                    payment_mode: order_details.payment_mode,
                    status: order_details.status,
                    updated_at: moment(order_details.updated_at).format('DD-MM-YYYY HH:mm:ss')

                  }
                  let mailToMerchant = await mailSender.MerchantTransactionMail(mailData);
                  let customerMail = await mailSender.CustomerTransactionMail(mailData)
                  console.log(mailToMerchant, customerMail);
                } catch (error) {
                  console.log(error);
                }

              });
              ee.emit('ping', {});
              // event base charges update end
              res.status(statusCode.ok).send(response.successdatamsg(api_res, 'Paid successfully.'));
            } else {
              let updateData = {
                status: mastercard_response_data.response.gatewayCode,
                class: 'ECOM',
              }
              await models.order.update(updateData, { where: { order_id: req.order.order_id } });
              await models.order_txn.create({
                order_id: req.order.order_id,
                txn: txn,
                status: mastercard_response_data.response.gatewayCode,
                type: mastercard_response_data.transaction.type=="PAYMENT"?'SALE':mastercard_response_data.transaction.type,
                amount: req.order.amount,
                currency: req.order.currency,
                created_at: new Date().toJSON().substring(0, 19).replace('T', ' ')
              });
              await models.res_dump.create({
                order_id: req.order.order_id,
                res_dump: JSON.stringify(mastercard_response_data)
              })
              let api_res = {
                order_status: mastercard_response_data.response.gatewayCode,
                order_id: req.order.order_id,
                payment_id: '',
                amount: req.order.amount,
                currency: req.order.currency
              }

              res.status(statusCode.ok).send(response.successdatamsg(api_res, mastercard_response_data.response.acquirerMessage));
            }

          })
          .catch(async (error) => {
            console.log(error);
            let updateData = {
              status: 'FAILED',
              payment_id: txn,
            }
            await models.order.update(updateData, { where: { order_id: req.order.order_id } });
            let api_res = {
              order_status: "FAILED",
              order_id: req.order.order_id,
              payment_id: txn,
              amount: req.order.amount,
              currency: req.order.currency
            }
            await models.order_txn.create({
              order_id: req.order.order_id,
              txn: txn,
              status: 'FAILED',
              amount: req.order.amount,
              currency: req.order.currency,
              res_dump: JSON.stringify(error.response?.data),
              created_at: new Date().toJSON().substring(0, 19).replace('T', ' ')
            });
            res.status(statusCode.ok).send(response.errorMsgWithData(error.response?.data.error.explanation, api_res));
          });


      }).catch((error) => {
        res.status(statusCode.ok).send(response.errormsg(error.message));
      })
    } catch (error) {
      console.log(error);
      res.status(statusCode.ok).send(response.errormsg(error.message));
    }
  },
  cancel: async (req, res) => {
    try {
      let updateData = {
        status: 'CANCELLED',
      }
      if (req.order.env == 'test') {
        models.order_test.update(updateData, { where: { order_id: req.body.order_id } }).then((result) => {
          let api_res = {
            order_status: "CANCELLED",
            payment_id: '',
            order_id: req.order.order_id,
            amount: req.order.amount,
            currency: req.order.currency
          }
          res.status(statusCode.ok).send(response.successdatamsg(api_res, 'Cancelled successfully.'));
        }).catch((error) => {
          res.status(statusCode.ok).send(response.errormsg(error.message));
        })
      } else {
        models.order.update(updateData, { where: { order_id: req.bodyString('order_id') } }).then((result) => {
          let api_res = {
            order_status: "CANCELLED",
            payment_id: '',
            order_id: req.order.order_id,
            amount: req.order.amount,
            currency: req.order.currency
          }
          res.status(statusCode.ok).send(response.successdatamsg(api_res, 'Cancelled successfully.'));
        }).catch((error) => {
          res.status(statusCode.ok).send(response.errormsg(error.message));
        })
      }
    } catch (error) {
      console.log(error);
      res.status(statusCode.ok).send(response.errormsg(error.message));
    }

  },
  failed: async (req, res) => {
    try {
      let updateData = {
        status: 'FAILED',
      }
      if (req.order.env == 'test') {
        models.order_test.update(updateData, { where: { order_id: req.bodyString('order_id') } }).then((result) => {
          let api_res = {
            order_status: "FAILED",
            payment_id: '',
            order_id: req.order.order_id,
            amount: req.order.amount,
            currency: req.order.currency
          }
          res.status(statusCode.ok).send(response.successdatamsg(api_res, 'Order failed.'));
        }).catch((error) => {
          res.status(statusCode.ok).send(response.errormsg(error.message));
        })
      } else {
        models.order.update(updateData, { where: { order_id: req.bodyString('order_id') } }).then((result) => {
          let api_res = {
            order_status: "FAILED",
            payment_id: '',
            order_id: req.order.order_id,
            amount: req.order.amount,
            currency: req.order.currency
          }
          res.status(statusCode.ok).send(response.successdatamsg(api_res, 'Order failed.'));
        }).catch((error) => {
          res.status(statusCode.ok).send(response.errormsg(error.message));
        })
      }

    } catch (error) {
      res.status(statusCode.ok).send(response.errormsg(error.message));
    }

  },
  refund: async (req, res) => {
    try {
      let txn = helpers.make_random_key('TXN');
      let username = process.env.MERCHANT_USERNAME + ':' + process.env.MERCHANT_PASSWORD;
      const encodedToken = Buffer.from(username).toString('base64');
      var data = JSON.stringify({
        "apiOperation": "REFUND",
        "transaction": {
          "amount": req.body.amount,
          "currency": req.body.currency
        }
      });

      var config = {
        method: 'put',
        url: process.env.MASTERCARD_TEST_URL + '/' + process.env.MERCHANT_KEY + '/order/' + req.body.order_id + '/transaction/' + txn,
        headers: {
          'Authorization': 'Basic ' + encodedToken,
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios(config)
        .then(async (api_res) => {
          let status = 'REFUNDED';;
          await models.order.update({ status: status, refund_response_dump: JSON.stringify(api_res.data) }, { where: { order_id: req.body.order_id } });
          let txn_ins = {
            order_id: req.body.order_id,
            txn: txn,
            status: 'APPROVED',
            type:"REFUNDED",
            amount: req.body.amount,
            currency: req.body.currency,
            res_dump: JSON.stringify(api_res.data),
            created_at: new Date().toJSON().substring(0, 19).replace('T', ' ')
          }
          await models.order_txn.create(txn_ins);
          res.status(statusCode.ok).send(response.successdatamsg({ order_id: txn_ins.order_id, txn: txn_ins.txn, amount: txn_ins.amount, currency: txn_ins.currency }, 'Refunded Successfully.'))
        })
        .catch(function (error) {
          console.log(error);
          res.status(statusCode.ok).send(response.errormsg('Unable to process refund or already refunded.'));
        });
    } catch (error) {
      res.status(statusCode.ok).send(response.errormsg(error.message));
    }
  },
  pay_3ds: async (req, res) => {
    var axios = require('axios');
    let txn = helpers.make_random_key('TXN');
    let username = process.env.MERCHANT_USERNAME + ':' + process.env.MERCHANT_PASSWORD;
    const encodedToken = Buffer.from(username).toString('base64');
    let order_id = req.body.transaction.reference;
    let card_id = req.body.card_id;
    let browserFP = req.browser_fp;
    delete req.body.card_id;
    delete req.body.save_card;
    delete req.body.sourceOfFunds.provided.card.name_on_card;
    console.log(req.body);
    var data = JSON.stringify(req.body);
    var config = {
      method: 'put',
      url: process.env.MASTERCARD_TEST_URL + process.env.MERCHANT_KEY + '/order/' + order_id + '/transaction/' + txn,
      headers: {
        'Authorization': 'Basic ' + encodedToken,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(async (result) => {


        let mtgs = result.data;
        let sourceOfFunds = mtgs.sourceOfFunds;
        if (mtgs.result == 'SUCCESS') {
          console.log(mtgs);
          let order_id = mtgs.transaction.reference;
          let order = await models.order.findOne({ where: { order_id: order_id } });

          let update_order = {
            status: 'AUTHORISED',
            class: "ECOM",
            payment_id: txn,
            payment_mode: sourceOfFunds.provided.card.fundingMethod + ' ' + sourceOfFunds.type,
            card_no: sourceOfFunds.provided.card.number,
            expiry_date: sourceOfFunds.provided.card.expiry.month + '-' + sourceOfFunds.provided.card.expiry.year,
            funding_method: sourceOfFunds.provided.card.fundingMethod,
            card_type: sourceOfFunds.provided.card.fundingMethod,
            card_brand: sourceOfFunds.provided.card.brand
          }
          await models.order.update(update_order, { where: { order_id: order_id } });
          let created_at = new Date().toJSON().substring(0, 19).replace('T', ' ');
          let txn_insert = {
            order_id: req.body.transaction.reference,
            txn: txn,
            status: mtgs.response.gatewayCode,
            type: mtgs.transaction.type=='PAYMENT'?'SALE': mtgs.transaction.type,
            amount: mtgs.transaction.amount,
            currency: mtgs.transaction.currency,
            created_at: created_at,
            browserFP: browserFP ? browserFP : ''
          }
          await models.order_txn.create(txn_insert);
          await models.res_dump.create({
            order_id: mtgs.order.id,
            res_dump: JSON.stringify(mtgs)
          });
          delete txn_insert.res_dump;
          txn_insert.return_url = order.return_url;
          // Adding event base email sending 
          ee.once('ping', async () => {
            try {
              //charge calculator
              let amount = req.body.order.amount;
              let charge_order_details = await models.order.findOne({ attributes: ['merchant_id'], where: { order_id: order_id } });
              let mid_details = await models.mid.findOne({ attributes: ['buy_percentage', 'buy_fixed'], where: { submerchant_id: charge_order_details.merchant_id } });
              const startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD');
              const endOfMonth = moment().clone().endOf('month').format('YYYY-MM-DD');
              console.log(startOfMonth);
              console.log(endOfMonth);
              let total_details = await models.order.findAll({ attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total_amount']], where: { created_at: { [op.between]: [startOfMonth, endOfMonth] }, merchant_id: charge_order_details.merchant_id, status: ['AUTHORISED'] } });
              let total = total_details[0].dataValues.total_amount;

              let plan_details = await models.pricing_plan.findOne({ attributes: ['from_amount', 'to_amount', 'monthly_fee', 'percentage_value', 'fixed_amount'], where: { from_amount: { [op.lte]: total }, to_amount: { [op.gte]: total } } });
              let buy_percentage = mid_details.buy_percentage;
              let buy_fixed = mid_details.buy_fixed;
              let buy_charge = buy_percentage == 0 ? buy_fixed : amount * buy_percentage / 100 + buy_fixed;
              let sell_charge = plan_details.percentage_value == 0 ? plan_details.fixed_amount : amount * plan_details.percentage_value / 100 + plan_details.fixed_amount;
              console.log(sell_charge);
              let settlement_amount = amount - sell_charge;
              let update_res = await models.order.update({ sale_charge: sell_charge, buy_charge: buy_charge, settlement_amount: settlement_amount }, { where: { order_id: order_id } });
              //mail sender
              let order_details = await models.order.findOne({ where: { order_id: order_id }, include: [{ model: models.master_merchant, as: 'merchant' }, { model: models.master_merchant_detail, as: 'merchant_details' }] });

              let mailData = {
                merchant_email: order_details.merchant.email,
                company_name: order_details.merchant_details.company_name,
                logo: order_details.merchant.logo,
                order_id: order_details.order_id,
                payment_id: order_details.payment_id,
                customer_name: order_details.customer_name,
                customer_email: order_details.customer_email,
                currency: order_details.currency,
                amount: order_details.amount,
                card_no: order_details.card_no,
                payment_mode: order_details.payment_mode,
                status: order_details.status,
                updated_at: moment(order_details.updated_at).format('DD-MM-YYYY HH:mm:ss')
              }
              console.log(mailData);
              let mailToMerchant = await mailSender.MerchantTransactionMail(mailData);
              let customerMail = await mailSender.CustomerTransactionMail(mailData)
              console.log(mailToMerchant, customerMail);
            } catch (error) {
              console.log(error);
            }

          });
          ee.emit('ping', {});
          // event base charges update end
          res.status(statusCode.ok).send(response.successdatamsg(txn_insert, 'Paid successfully.'));
        } else {
          let order;
          order = await models.order.findOne({ where: { order_id: mtgs.order.id } }) || await models.order_test.findOne({ where: { order_id: mtgs.order.id } });
          let update_order = {
            status: mtgs.result,
          }
          await models.order.update(update_order, { where: { id: order.id } });
          let created_at = new Date().toJSON().substring(0, 19).replace('T', ' ');
          let txn_insert = {
            order_id: mtgs.order.id,
            txn: txn,
            status: mtgs.response.gatewayCode,
            type: mtgs.transaction.type=='PAYMENT'?'SALE':"",
            amount: mtgs.transaction.amount,
            currency: mtgs.transaction.currency,
            created_at: created_at
          }
          await models.order_txn.create(txn_insert);
          await models.res_dump.create({
            order_id: mtgs.order.id,
            res_dump: JSON.stringify(mtgs)
          });
          res.status(statusCode.ok).send(response.errorMsgWithData('Unable to process payment', mtgs));
        }
      })
      .catch(function (error) {
        console.log(error);
        res.status(statusCode.ok).send(response.errorMsgWithData('Unable to process payment', error));
      });

  },
  void_transaction: async (req, res) => {
    try {
      // fetch order details
      let order = await models.order.findOne({ where: { order_id: req.body.order_id } })
      let new_txn = helpers.make_random_key('TXN');
      let username = process.env.MERCHANT_USERNAME + ':' + process.env.MERCHANT_PASSWORD;
      const encodedToken = Buffer.from(username).toString('base64');
      var axios = require('axios');
      var data = JSON.stringify({
        "apiOperation": "VOID",
        "transaction": {
          "targetTransactionId": order.payment_id
        }
      });

      var config = {
        method: 'put',
        url: process.env.MASTERCARD_TEST_URL + process.env.MERCHANT_KEY + '/order/' + order.order_id + '/transaction/' + new_txn,
        headers: {
          'Authorization': 'Basic ' + encodedToken,
          'Content-Type': 'application/json'
        },
        data: data
      };
      axios(config)
        .then(async function (mtgs_response) {
          let mtgs_res = mtgs_response.data;
          if (mtgs_res.result == 'SUCCESS') {
            let update_order = {
              status: 'VOID',
              payment_id: new_txn,
            }
            let updateOrder = await models.order.update(update_order, { where: { id: order.id } });
            let created_at = new Date().toJSON().substring(0, 19).replace('T', ' ');
            let ins_txn = {
              order_id: order.order_id,
              txn: new_txn,
              status: 'APPROVED',
              type:"VOID",
              amount: order.amount,
              currency: order.currency,
              res_dump: JSON.stringify(mtgs_response.data),
              created_at: created_at
            };

            models.order_txn.create(ins_txn).then((result) => {
              delete ins_txn.res_dump;
              delete ins_txn.created_at;
              res.status(statusCode.ok).send(response.successdatamsg(ins_txn, 'Transaction voided successfully.'));
            });
          } else {
            res.status(statusCode.ok).send(response.errorMsgWithData('Unable to void transaction', error.response.data));
          }
        })
        .catch(function (error) {
          res.status(statusCode.ok).send(response.errorMsgWithData('Unable to void transaction', error.response.data));
        });

    } catch (error) {
      res.status(statusCode.ok).send(response.errorMsgWithData('Unable to void transaction', error.response.data));
    }
  },
  details_with_transaction: async (req, res) => {
    try {
      let order_id = req.body.order_id;
      let order_details = await models.order.findOne({ attributes: ['payment_mode', 'amount', 'currency', 'card_no', 'order_id', 'expiry_date', 'updated_at', 'funding_method'], include: [{ model: models.master_merchant_detail, as: 'merchant_details', attributes: ['mcc_codes'] }], where: { order_id: order_id } });
      let order_txn = await models.order_txn.findAll({ where: { order_id: order_id } });
      let send_res = {
        merchant_category_code: order_details.merchant_details?.mcc_codes,
        payment_method: order_details.payment_mode,
        authorized_amount: order_details.currency + ' ' + order_details.amount,
        account_identifier: order_details.card_no,
        order_id: order_details.order_id,
        card_expiry_date: order_details.expiry_date,
        order_date: moment(order_details.updated_at).format('D-M-YYYY h:mm A'),
        funding_method: order_details.funding_method,
        transactions: []
      }
      for (transaction of order_txn) {
        console.log(transaction);
        var temp = {
          date_time: moment(transaction.created_at).format('D-M-YYYY h:mm A'),
          type: transaction.type,
          gateway_code: transaction.status,
          amount: transaction.amount + ' ' + transaction.currency,
        }
        send_res.transactions.push(temp)
      }
      res.status(statusCode.ok).send(response.successdatamsg(send_res, 'Details fetched successfully.'));
    } catch (error) {
      res.status(statusCode.ok).send(response.errorMsgWithData('Unable to fetch details', error.message));
    }
  },
  details_with_transaction_print: async (req, res) => {
    try {
      let order_id = req.body.order_id;
      let order_details = await models.order.findOne({ attributes: ['payment_mode', 'amount', 'currency', 'card_no', 'order_id', 'expiry_date', 'updated_at', 'funding_method', 'customer_name', 'customer_email', 'customer_mobile', 'billing_address_line_1', 'billing_address_line_2', 'billing_city', 'billing_province', 'billing_country', 'billing_pincode', 'shipping_address_line_1', 'shipping_address_line_2', 'shipping_city', 'shipping_province', 'shipping_country', 'shipping_pincode'], include: [{ model: models.master_merchant_detail, as: 'merchant_details', attributes: ['mcc_codes'] }, { model: models.master_merchant, as: 'merchant', attributes: ['name', 'email', 'code', 'mobile_no'] }], where: { order_id: order_id } });
      let order_txn = await models.order_txn.findAll({ where: { order_id: order_id } });
      let send_res = {
        merchant_category_code: order_details.merchant_details.mcc_codes,
        payment_method: order_details.payment_mode,
        authorized_amount: order_details.currency + ' ' + order_details.amount,
        account_identifier: order_details.card_no,
        order_id: order_details.order_id,
        card_expiry_date: order_details.expiry_date,
        order_date: moment(order_details.updated_at).format('D-M-YYYY h:mm A'),
        funding_method: order_details.funding_method,
        transactions: [],
        customer_details: {
          name: order_details.customer_name,
          email: order_details.customer_email,
          mobile_no: order_details.customer_mobile,
          billing_address: {
            address_line_1: order_details.billing_address_line_1,
            address_line_2: order_details.billing_address_line_2,
            city: order_details.billing_city,
            province: order_details.billing_province,
            country: order_details.billing_country,
            pincode: order_details.billing_pincode

          },
          shipping_address: {
            address_line_1: order_details.shipping_address_line_1,
            address_line_2: order_details.shipping_address_line_2,
            city: order_details.shipping_city,
            province: order_details.shipping_province,
            country: order_details.shipping_country,
            pincode: order_details.shipping_pincode
          }
        },
        merchant_details: {
          name: order_details.merchant.name,
          email: order_details.merchant.email,
          mobile_no: order_details.merchant.code + ' ' + order_details.merchant.mobile_no
        }
      }
      for (transaction of order_txn) {
        console.log(transaction);
        var temp = {
          date_time: moment(transaction.created_at).format('D-M-YYYY h:mm A'),
          type: transaction.type,
          gateway_code: transaction.status,
          amount: transaction.amount + ' ' + transaction.currency,
        }
        send_res.transactions.push(temp)
      }
      res.status(statusCode.ok).send(response.successdatamsg(send_res, 'Details fetched successfully.'));
    } catch (error) {
      res.status(statusCode.ok).send(response.errorMsgWithData('Unable to fetch details', error.message));
    }
  },
  saveCard: async (req, res, next) => {
    if (req.bodyString("card_id") == "") {
      let save_card = req.bodyString("save_card");
      let browser_token = {
        os: req.headers.os,
        browser: req.headers.browser,
        browser_version: req.headers.browser_version,
        ip: req.headers.ip,
      };
      let browser_token_enc = md5(JSON.stringify(browser_token));
      console.log(req.body.sourceOfFunds.provided.card);
      let card_exits = await models.card.findOne({ attributes: ['id'], where: { card_number: helpers.encrypt(req.body.sourceOfFunds.provided.card.number), browser_token: browser_token_enc, deleted: 0 } });
      console.log(`card not exits and save card`)
      const params = {
        bin_number: req.body.sourceOfFunds.provided.card.number.slice(0, 6),
      };
      const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'User-ID': process.env.LOOKUP_USER_ID, 'API-Key': process.env.LOOKUP_USER_ID_SECRET },
        data,
        url: process.env.LOOKUP_URL + 'bin-lookup',
      };
      let card_network = await axios(options);
      console.log(card_exits);
      if (!card_exits && save_card) {
        let created_at = new Date().toJSON().substring(0, 19).replace("T", " ");
        let updated_at = new Date().toJSON().substring(0, 19).replace("T", " ");
        let card = {
          name_on_card: req.body.sourceOfFunds.provided.card.name_on_card,
          card_number: helpers.encrypt(req.body.sourceOfFunds.provided.card.number),
          card_expiry: req.body.sourceOfFunds.provided.card.expiry.month + '/' + req.body.sourceOfFunds.provided.card.expiry.year,
          card_nw: card_network.data['card-brand'],
          last_4_digit: req.body.sourceOfFunds.provided.card.number.slice(-4),
          browser_token: browser_token_enc,
          created_at: created_at,
          updated_at: updated_at,
          deleted: 0,
          status: 0
        };
        let ins_card = await models.card.create(card)
        req.browser_fp = browser_token_enc;
        next();
      } else {
        let browser_token = {
          os: req.headers.os,
          browser: req.headers.browser,
          browser_version: req.headers.browser_version,
          ip: req.headers.ip,
        };
        let browser_token_enc = md5(JSON.stringify(browser_token));
        req.browser_fp = browser_token_enc;
        next();
      }
    } else {
      next();
    }
  },
  cardList: async (req, res, next) => {
    let dec_token = req.bodyString("token");
    if (dec_token) {
      let customer_cards = await models.card.findAll({ where: { browser_token: dec_token, deleted: 0 } });
      if (customer_cards[0]) {
        let cards = [];
        for (let card of customer_cards) {
          let card_obj = {
            card_id: helpers.encrypt(card.id),
            Name: card.name_on_card ? card.name_on_card : '',
            ExpiryDate: card.card_expiry,
            CardNetwork: card.card_nw,
            Card: card.last_4_digit,
            Image: process.env.STATIC_URL + "/images/visa-image.png",
          };
          cards.push(card_obj);
        }
        res.status(statusCode.ok).send(
          response.successdatamsg(cards, "List fetched successfully.")
        );
      } else {
        res.status(statusCode.badRequest).send(
          response.successdatamsg([], "No card found.")
        );
      }
    } else {
      res.status(statusCode.ok).send(
        response.successdatamsg([], "No card found.")
      );
    }
  },
  card_delete: async (req, res) => {
    models.card.update({ deleted: 1 }, { where: { id: helpers.decrypt(req.bodyString('card_id')) } }).then((result) => {
      res.status(statusCode.ok).send(
        response.successmsg("Card deleted successfully.")
      );
    }).catch((error) => {
      res.status(statusCode.ok).send(
        response.errormsg("Unable to  delete card.")
      );
    })
  },
  card_details: async (req, res) => {
    models.card.findOne({ where: { id: helpers.decrypt(req.bodyString('card_id')) } }).then((result) => {
      let card_obj = {
        card_id: helpers.encrypt(result.id),
        Name: result.name_on_card ? result.name_on_card : '',
        ExpiryDate: result.card_expiry,
        CardNetwork: result.card_nw,
        Card: helpers.decrypt(result.card_number),
        Image: process.env.STATIC_URL + "/images/visa-image.png",
      };
      res.status(statusCode.ok).send(
        response.successdatamsg(card_obj, "Details fetched successfully.")
      );
    }).error((error) => {
      res.status(statusCode.ok).send(
        response.errormsg("Unable to fetched details.")
      );
    })
  },
  fraudCheck: async (req, res) => {
    let order_id = req.bodyString('order_id');
    models.order.findOne({ attributes: ['block_for_suspicious_ip', 'block_for_suspicious_email', 'block_for_transaction_limit'], where: { order_id: order_id } }).then((result) => {
      if (result) {
        if (result.block_for_suspicious_ip == "1") {
          res.status(statusCode.ok).send(
            response.errormsg("Transaction block for transaction from suspicious ip.")
          );
        } else if (result.block_for_suspicious_email == '1') {
          res.status(statusCode.ok).send(
            response.errormsg("Transaction block for transaction from suspicious email.")
          );
        } else if (result.block_for_transaction_limit == "1") {
          res.status(statusCode.ok).send(
            response.errormsg("Transaction block for higher transaction limit.")
          );
        } else {
          res.status(statusCode.ok).send(
            response.successmsg("Valid order, transaction can be process.")
          );
        }
      } else {
        res.status(statusCode.ok).send(
          response.errormsg("Invalid order id.")
        );
      }
    }).catch((error) => {
      res.status(statusCode.ok).send(
        response.errormsg("Invalid order id.")
      );
    })


  },
  chargeCalculate: async (req, res) => {
    try {
      let order_id = req.body.transaction.reference;
      let amount = req.body.order.amount;
      let order_details = await models.order.findOne({ attributes: ['merchant_id'], where: { order_id: order_id } });
      let mid_details = await models.mid.findOne({ attributes: ['buy_percentage', 'buy_fixed'], where: { submerchant_id: order_details.merchant_id } });
      const startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment().clone().endOf('month').format('YYYY-MM-DD');
      console.log(startOfMonth);
      console.log(endOfMonth);
      let total_details = await models.order.findAll({ attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total_amount']], where: { created_at: { [op.between]: [startOfMonth, endOfMonth] }, merchant_id: order_details.merchant_id, status: ['AUTHORISED', 'APPROVED'] } });
      let total = total_details[0].dataValues.total_amount;

      let plan_details = await models.pricing_plan.findOne({ attributes: ['from_amount', 'to_amount', 'monthly_fee', 'percentage_value', 'fixed_amount'], where: { from_amount: { [op.lte]: total }, to_amount: { [op.gte]: total } } });
      let buy_percentage = mid_details.buy_percentage;
      let buy_fixed = mid_details.buy_fixed;
      let buy_charge = buy_percentage == 0 ? buy_fixed : amount * buy_percentage / 100 + buy_fixed;
      let sell_charge = plan_details.percentage_value == 0 ? plan_details.fixed_amount : amount * plan_details.percentage_value / 100 + plan_details.fixed_amount;
      console.log(sell_charge);
      let settlement_amount = amount - sell_charge;
      let update_res = await models.order.update({ sale_charge: sell_charge, buy_charge: buy_charge, settlement_amount: settlement_amount }, { where: { order_id: order_id } });

    } catch (error) {
      console.log(error);
    }

  },
  saveCardPay: async (req, res, next) => {
    if (req.bodyString("card_id") == "") {
      let save_card = req.bodyString("save_card");
      let browser_token = {
        os: req.headers.os,
        browser: req.headers.browser,
        browser_version: req.headers.browser_version,
        ip: req.headers.ip,
      };
      let browser_token_enc = md5(JSON.stringify(browser_token));
      let card_exits = await models.card.findOne({ attributes: ['id'], where: { card_number: helpers.encrypt(req.body.card.number), browser_token: browser_token_enc, deleted: 0 } });
      console.log(`card not exits and save card`)
      const params = {
        bin_number: req.body.card.number.slice(0, 6),
      };
      const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'User-ID': process.env.LOOKUP_USER_ID, 'API-Key': process.env.LOOKUP_USER_ID_SECRET },
        data,
        url: process.env.LOOKUP_URL + 'bin-lookup',
      };
      let card_network = await axios(options);
      console.log(card_exits);
      if (!card_exits && save_card) {
        let created_at = new Date().toJSON().substring(0, 19).replace("T", " ");
        let updated_at = new Date().toJSON().substring(0, 19).replace("T", " ");
        let card = {
          name_on_card: req.body.card.name_on_card,
          card_number: helpers.encrypt(req.body.card.number),
          card_expiry: req.body.card.expiry.month + '/' + req.body.card.expiry.year,
          card_nw: card_network.data['card-brand'],
          last_4_digit: req.body.card.number.slice(-4),
          browser_token: browser_token_enc,
          created_at: created_at,
          updated_at: updated_at,
          deleted: 0,
          status: 0
        };
        let ins_card = await models.card.create(card)
        req.browser_fp = browser_token_enc;
        next();
      } else {
        let browser_token = {
          os: req.headers.os,
          browser: req.headers.browser,
          browser_version: req.headers.browser_version,
          ip: req.headers.ip,
        };
        let browser_token_enc = md5(JSON.stringify(browser_token));
        req.browser_fp = browser_token_enc;
        next();
      }
    } else {
      next();
    }
  },



}
module.exports = Order;


