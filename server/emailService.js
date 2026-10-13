
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
    const result = await resend.emails.send({
        from: "My Marketplace <onboarding@resend.dev>",
        to,
        subject,
        text,
        html
    });

    if (result.error) {
        throw new Error(result.error.message);
    }

    return result.data;
};

module.exports = {
    sendEmail
};
