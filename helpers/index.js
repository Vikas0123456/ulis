const StatusCode = require('../utilities/statuscode/index');
const ServerResponse = require('../utilities/response/ServerResponse');
const path = require('path')
require('dotenv').config({ path: "../.env" });
const X_Username = process.env.X_Username;
const X_Password = process.env.X_Password;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const CryptoJS = require("crypto-js")
var Sha256 = require("crypto-js/sha256");
var Hex = require('crypto-js/enc-hex');
var Utf8 = require('crypto-js/enc-utf8');
var Base64 = require('crypto-js/enc-base64');
var AES = require("crypto-js/aes");
var base64 = require('base-64');
const { models } = require('../sequelize/index');
var helpers = {
  successResponse: (req, res, data, code = 200) => res.send({
    code,
    data,
    success: true,
  }),

  errorResponse: (
    req,
    res,
    errorMessage = 'Something went wrong',
    code = 500,
    error = {},
  ) => res.status(500).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  }),


  validateEmail: (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  validateFields: (object, fields) => {
    const errors = [];
    fields.forEach((f) => {
      if (!(object && object[f])) {
        errors.push(f);
      }
    });
    return errors.length ? `${errors.join(', ')} are required fields.` : '';
  },

  uniqueId: (length = 13) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  checkHeader: (req, res, next) => {
    const authHeader = req.headers;
    let username = authHeader.xusername
    let password = authHeader.xpassword
    if (username === X_Username && password === X_Password) {
      next()
    } else {
      res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Unauthorized request', 'E0001'));
    }
  },
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1day' });
  },
  orderToken: (req, res, next) => {
    const token = req.body.token || req.body.order_details.token;
    if (token == null) {
      res.status(StatusCode.expired).send(ServerResponse.errormsg('Invalid order token', 'E0060'));
    } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, order) => {
        if (err) {
          if (err.message == "jwt expired") {
            res
              .status(StatusCode.expired)
              .send(ServerResponse.errormsg('Token Expired Please Login', "E0059"));
          } else {
            res
              .status(StatusCode.expired)
              .send(ServerResponse.errormsg('Unable To Validate Token', 'E0060'));
          }
        } else {
          req.order = order;
          next();
        }
      });
    }
  },
  encrypt: (nor_text) => {
    let string = nor_text.toString()
    let secret_key = process.env.SECRET_KEY;
    let secret_iv = process.env.SECRET_IV;
    var key = Sha256(secret_key).toString(Hex).substr(0, 32); // Use the first 32 bytes (see 2.)
    var iv = Sha256(secret_iv).toString(Hex).substr(0, 16);
    var output = false;

    output = AES.encrypt(string, Utf8.parse(key), {
      iv: Utf8.parse(iv),
    }).toString();
    output = Utf8.parse(output).toString(Base64);
    return output;

  },
  decrypt: (cipher_text) => {
    try {
      let string = cipher_text.toString()
      let secret_key = process.env.SECRET_KEY;
      let secret_iv = process.env.SECRET_IV;
      var key = Sha256(secret_key).toString(Hex).substr(0, 32); // Use the first 32 bytes (see 2.)
      var iv = Sha256(secret_iv).toString(Hex).substr(0, 16);
      var output = false;

      string = base64.decode(string);

      output = AES.decrypt(string, Utf8.parse(key), {
        iv: Utf8.parse(iv),
      }).toString(Utf8);
      return output;
    } catch (error) {
      return false;
    }
  },
  make_random_key: (pre) => {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();
    let str = pre;
    str += randomString(1) + year + randomString(1) + month + randomString(1) + day + randomString(1);
    str = str.toUpperCase();
    return str
  },
  company_details: async (condition) => {
    let company_details = await models.company.findOne({ where: condition });
    return company_details;
  },
  get_title: async (condition) => {
    let title = await models.title.findOne({ where: condition });
    return title;
  },


}
module.exports = helpers;
function randomString(length, capslock = 0) {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  if (capslock == 1) {
    return result.toUpperCase();
  } else {
    return result;
  }

}