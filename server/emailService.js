
require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, "")
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
});

const sendEmail = async ({ to, subject, text, html }) => {
    return transporter.sendMail({
        from: `"My Marketplace" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    });
};

module.exports = {
    sendEmail
};
