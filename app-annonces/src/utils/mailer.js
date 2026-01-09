const { createTransport } = require('nodemailer');
require('dotenv').config({quiet: true});

const transporter = createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
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
        return true;
    } catch(error) {
        return error;
    }
}

module.exports = {
    mailer
}