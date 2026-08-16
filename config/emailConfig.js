const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,

    secure:
        process.env.EMAIL_SECURE === "true" ||
        Number(process.env.EMAIL_PORT) === 465,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Verify email service connection
 */
const verifyEmailConnection = async () => {
    try {
        await transporter.verify();

        console.log("Email service connected successfully.");

        return true;
    } catch (error) {
        console.error(
            "Email service connection failed:",
            error.message
        );

        return false;
    }
};

/**
 * Send an email
 */
const sendEmail = async ({
    to,
    subject,
    text,
    html,
}) => {
    try {
        const fromName =
            process.env.EMAIL_FROM_NAME ||
            "Jumia Inventory Management";

        const fromEmail =
            process.env.EMAIL_FROM ||
            process.env.EMAIL_USER;

        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(
            `Email sent to ${to}: ${info.messageId}`
        );

        return info;
    } catch (error) {
        console.error(
            `Failed to send email to ${to}:`,
            error.message
        );

        throw error;
    }
};

module.exports = {
    transporter,
    sendEmail,
    verifyEmailConnection,
};