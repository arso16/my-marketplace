require("dotenv").config();

const { sendEmail } = require("./emailService");

async function testEmail() {
    try {
        await sendEmail({
            to: process.env.EMAIL_USER,
            subject: "My Marketplace email test",
            text: "Success! Your My Marketplace email service is working."
        });

        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Email test failed:", error.message);
    }
}

testEmail();
