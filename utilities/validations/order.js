const Joi = require('joi').extend(require('@joi/date')).extend(require('joi-currency-code'));
const ServerResponse = require('../response/ServerResponse');
const StatusCode = require('../statuscode/index');
const { models } = require('../../sequelize/index');
const helpers = require('../../helpers/index');
const order = require('../../sequelize/models/order');
const Order = {
    create: async (req, res, next) => {
        try {
            let customer_details = req.body.data.customer_details;
            let order_details = req.body.data.order_details;

            const customer_details_schema = Joi.object().keys({
                name: Joi.string().required().error(() => {
                    return new Error("Valid name required")
                }),
                email: Joi.string().email().required().error(() => {
                    return new Error("Valid email required")
                }),
                mobile: Joi.string().length(10).pattern(/^[0-9]+$/).allow('').error(() => {
                    return new Error("Valid mobile required")
                }),
            })
            const order_details_schema = Joi.object().keys({
                order_id: Joi.string().required().error(() => {
                    return new Error("Order id required")
                }),
                amount: Joi.number().required().error(() => {
                    return new Error("Valid amount required")
                }),
                currency: Joi.string().required().error(() => {
                    return new Error("Valid currency required")
                }),
                return_url: Joi.string().uri().required().error(() => {
                    return new Error("Valid return url required")
                }),
            })

            const result1 = customer_details_schema.validate(customer_details);
            if (result1.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result1.error.message));
            }
            const result2 = order_details_schema.validate(order_details);
            if (result2.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result2.error.message));
            }
            if (!result1.error && !result2.error) {
                /** *************** Check Order is valid or not  **************************************/
                models.order.findOne({ attributes: ['id'], where: { merchant_id: req.credentials.merchant_id, order_id: req.body.data.order_details.order_id } }).then((result) => {
                    if (!result) {
                        next();
                    } else {
                        res.status(StatusCode.ok).send(ServerResponse.errormsg(`Order id already exits`));
                    }
                }).catch((error) => {
                    res.status(StatusCode.ok).send(ServerResponse.errormsg`Order id already exits`);
                })
                /** ********************************* END ********************************************/
            }
        } catch (error) {
            res.status(StatusCode.ok).send(ServerResponse.errormsg('Unable to process inputs'));
        }
    },
    details: async (req, res, next) => {
        try {
            const schema = Joi.object().keys({
                order_id: Joi.string().required().error(() => {
                    return new Error("Order id required")
                }),
                token: Joi.string().required().error(() => {
                    return new Error("Token required")
                })
            })
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let order_id = req.body.order_id;
                let merchant_id = req.order.merchant_id;
                models.order.findOne({ attributes: ['id'], where: { merchant_id: merchant_id, order_id: order_id } }).then((result) => {
                    if (result) {
                        next();
                    } else {
                        res.status(StatusCode.ok).send(ServerResponse.errormsg(`Invalid order id`));
                    }
                }).catch((error) => {
                    console.log(error);
                    res.status(StatusCode.ok).send(ServerResponse.errormsg`Invalid order id`);
                })

            }
        } catch (error) {
            res.status(StatusCode.ok).send(ServerResponse.errormsg`Unable to process inputs`);
        }
    },
    update: async (req, res, next) => {
        try {
            const schema = Joi.object().keys({
                order_id: Joi.string().required().error(() => {
                    return new Error("Order id required")
                }),
                token: Joi.string().required().error(() => {
                    return new Error("Token required")
                })
            })
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let order_id = req.body.order_id;
                let merchant_id = req.order.merchant_id;
                models.order.findOne({ attributes: ['id'], where: { merchant_id: merchant_id, order_id: order_id, status: 'PENDING' } }).then((result) => {
                    if (result) {
                        next();
                    } else {
                        res.status(StatusCode.ok).send(ServerResponse.errormsg(`Invalid order id or order is already processed.`));
                    }
                }).catch((error) => {
                    console.log(error);
                    res.status(StatusCode.ok).send(ServerResponse.errormsg`Invalid order id`);
                })

            }
        } catch (error) {
            res.status(StatusCode.ok).send(ServerResponse.errormsg`Unable to process inputs`);
        }
    },
    pay: async (req, res, next) => {
        try {
            let card_details = req.body.card;
            let order_details = req.body.order_details;

            let card_details_schema = Joi.object().keys({
                name_on_card:Joi.string().required().error(()=>{
                    return new Error("Name required")
                }),
                number: Joi.string().required().error(() => {
                    return new Error("Valid card number required")
                }),
                expiry: Joi.object({
                    month: Joi.string().required().error(() => {
                        return new Error("Expiry month required")
                    }),
                    year: Joi.string().required().error(() => {
                        return new Error("Expiry year required")
                    })
                }).required().error(() => {
                    return new Error("Expiry details required")
                }),
                security_code: Joi.string().length(3).pattern(/^[0-9]+$/).allow('').error(() => {
                    return new Error("Valid security code required")
                })
            });
            let order_details_schema = Joi.object().keys({
                order_id: Joi.string().required().error(() => {
                    return new Error("Order id required")
                }),
                token: Joi.string().required().error(() => {
                    return new Error("Token required")
                })
            })
            const result1 = card_details_schema.validate(card_details);
            if (result1.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result1.error.message));
            }
            const result2 = order_details_schema.validate(order_details);
            if (result2.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result2.error.message));
            }
            if (!result1.error && !result2.error) {
                models.order.findOne({ attributes: ['id'], where: { merchant_id: req.order.merchant_id, order_id: req.body.order_details.order_id, status: 'PENDING' } }).then((result) => {
                    if (result) {
                        next();
                    } else {
                        res.status(StatusCode.ok).send(ServerResponse.errormsg(`Order is already processed.`));
                    }
                }).catch((error) => {
                    res.status(StatusCode.ok).send(ServerResponse.errormsg`Unable to process inputs`);
                })
            }
        } catch (error) {
            res.status(StatusCode.ok).send(ServerResponse.errormsg`Unable to process inputs`);
        }
    },
    refund: async (req, res, next) => {
        try {
            let schema = Joi.object().keys({
                order_id: Joi.string().required().error(() => {
                    return new Error('Order id required')
                }),
                mode: Joi.string().valid('test', 'live').required(() => {
                    return new Error('Mode required')
                }),
                amount: Joi.number().precision(2).required().error(() => {
                    return new Error('Amount required')
                }),
                currency: Joi.string().currency().required().error(() => {
                    return new Error('Valid currency required')
                })
            })
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                /** *************** Check Order is valid or not  **************************************/
                models.order.findOne({ attributes: ['id'], where: { order_id: req.body.order_id, status: ['AUTHORISED', 'REFUNDED'] } }).then((result) => {
                    if (result) {
                        next();
                    } else {
                        res.status(StatusCode.ok).send(ServerResponse.errormsg(`Unable to initiate refund.`));
                    }
                }).catch((error) => {
                    res.status(StatusCode.ok).send(ServerResponse.errormsg(`Unable to initiate refund.`));
                })
                /** ********************************* END ********************************************/
            }
        } catch (error) {
            res.status(StatusCode.ok).send(ServerResponse.errormsg('Unable to process inputs'));
        }
    },
    void_transaction: async (req, res, next) => {
        try {
            const schema = Joi.object().keys({
                order_id: Joi.string().required().error(() => {
                    return new Error("Order id required")
                }),
            })
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let order_id = req.body.order_id;
                let order_exits = await models.order.findOne({ where: { status: 'AUTHORISED', order_id: order_id } });
                if (order_exits) {
                    next();
                } else {
                    res.status(StatusCode.ok).send(ServerResponse.errormsg(`Invalid order id or transaction can't be void`));
                }
            }

        } catch (error) {
            console.log(error);
            res.status(StatusCode.ok).send(ServerResponse.errormsg`Unable to process inputs`);
        }
    },
    transaction_details: async (req, res, next) => {
        try {
            const schema = Joi.object().keys({
                order_id: Joi.string().required().error(() => {
                    return new Error("Order id required")
                }),
            })
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let order_id =req.body.order_id;
                let order_exits = await models.order.findOne({ where: { order_id: order_id } });
                if (order_exits) {
                    next();
                } else {
                    res.status(StatusCode.ok).send(ServerResponse.errormsg(`Invalid order id`));
                }
            }

        } catch (error) {
            console.log(error);
            res.status(StatusCode.ok).send(ServerResponse.errormsg`Unable to process inputs`);
        }
    },
    card_delete: async (req, res, next) => {
        try {
            let schema = Joi.object().keys({
                card_id: Joi.string().required().error(() => {
                    return new Error('Card id required')
                }),
            })
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                /** *************** Check Order is valid or not  **************************************/
                models.card.findOne({ attributes: ['id'], where: { id: helpers.decrypt(req.bodyString('card_id')),deleted:0 } }).then((result) => {
                    if (result) {
                        next();
                    } else {
                        res.status(StatusCode.ok).send(ServerResponse.errormsg(`Invalid card id or already deleted.`));
                    }
                }).catch((error) => {
                    res.status(StatusCode.ok).send(ServerResponse.errormsg(`Invalid card id or already deleted.`));
                })
                /** ********************************* END ********************************************/
            }
        } catch (error) {
            res.status(StatusCode.ok).send(ServerResponse.errormsg('Unable to process inputs'));
        }
    },
    card_details: async (req, res, next) => {
        try {
            let schema = Joi.object().keys({
                card_id: Joi.string().required().error(() => {
                    return new Error('Card id required')
                }),
            })
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                /** *************** Check Order is valid or not  **************************************/
                models.card.findOne({ attributes: ['id'], where: { id: helpers.decrypt(req.bodyString('card_id')),deleted:0 } }).then((result) => {
                    if (result) {
                        next();
                    } else {
                        res.status(StatusCode.ok).send(ServerResponse.errormsg(`Invalid card id or  deleted.`));
                    }
                }).catch((error) => {
                    res.status(StatusCode.ok).send(ServerResponse.errormsg(`Invalid card id or deleted.`));
                })
                /** ********************************* END ********************************************/
            }
        } catch (error) {
            res.status(StatusCode.ok).send(ServerResponse.errormsg('Unable to process inputs'));
        }
    },



}
module.exports = Order;