require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, "")
    }
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
