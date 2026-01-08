const { createTransport } = require('nodemailer');
require('dotenv').config();

const transporter = createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    // secure: process.env.MAILER_SECURE,
    // auth: {
    //     user: process.env.MAILER_USERNAME,
    //     pass: process.env.MAILER_PASSWORD
    // }
});

const mailer = async (to, subject, text, html) => {
    try{
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            text,
            html
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch(error) {
        return error;
    }
}

module.exports = {
    mailer
}