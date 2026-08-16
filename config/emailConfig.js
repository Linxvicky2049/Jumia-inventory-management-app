const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log("Email service connected successfully.");
        return true;
    } catch (error) {
        console.error("Email service connection failed:", error.message);
        return false;
    }
};

module.exports = {
    transporter,
    verifyEmailConnection,
};