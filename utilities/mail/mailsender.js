const nodemailer = require("nodemailer");
const helpers = require('../../helpers/index');
const customer_transaction_mail = require("../mail-template/customer_transaction_mail");
const merchant_transaction_mail = require("../mail-template/merchant_transaction_mail");
require('dotenv').config({ path: "../../.env" });
const server_addr = process.env.SERVER_LOAD
const port = process.env.SERVER_PORT

var mailSender = {

    CustomerTransactionMail: async (data) => {
        let smtp_details = await helpers.company_details({ id: 1 });
        let title = await helpers.get_title({ id: 1 });
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr + ":" + port + "/static/images/";
        let logo = image_path + smtp_details.company_logo;
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: data.customer_email, // list of receivers
            subject: "Transaction Receipt", // Subject line
            html: customer_transaction_mail(data, logo, title.title), // html body
        });
    },
    MerchantTransactionMail: async (data) => {
        let smtp_details = await helpers.company_details({ id: 1 });
        let title = await helpers.get_title({ id: 1 });
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr + ":" + port + "/static/images/";
        let logo = image_path + smtp_details.company_logo;
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: data.merchant_email, // list of receivers
            subject: "Transaction Details", // Subject line
            html: merchant_transaction_mail(data, logo, title.title), // html body
        });
    },
}
module.exports = mailSender;