const {models} = require('../../sequelize/index');
const StatusCode = require('../statuscode/index');
const ServerResponse = require('../response/ServerResponse');
module.exports = async (req, res, next) => {
    const authHeader = req.headers;
    let merchant_key = authHeader.merchant_key
    let merchant_secret = authHeader.merchant_secret
    if (!merchant_secret && !merchant_key) {
        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Unauthorized request', 'E0001'));
    } else {
        models.merchant_key_and_secret.findOne({ attributes: ['merchant_id', 'type'], where: { merchant_key: merchant_key, merchant_secret: merchant_secret } }).then(async(result) => {
            let super_merchant_id_details = await models.master_merchant.findOne({attributes:['super_merchant_id'],where:{id:result.merchant_id}})
            let payload = {
                merchant_id:result.merchant_id,
                super_merchant:super_merchant_id_details.super_merchant_id,
                type:result.type
            }
           req.credentials = payload;
           next();
        }).catch((error) => {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Unauthorized access', 'E0001'));
        })
    }
}