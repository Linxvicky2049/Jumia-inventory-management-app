const nodemailer = require("nodemailer");

const isEmailEnabled = () => {
    return Boolean(
        process.env.EMAIL_HOST &&
        process.env.EMAIL_PORT &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS
    );
};

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT || 587) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, html, text }) => {
    if (!isEmailEnabled()) {
        return {
            success: false,
            message: "Email is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS.",
        };
    }

    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    });

    return {
        success: true,
        messageId: info.messageId,
    };
};

const sendWelcomeEmail = async (user) => {
    if (!user || !user.email) {
        return { success: false, message: "No recipient email provided." };
    }

    return sendEmail({
        to: user.email,
        subject: "Welcome to Jumia Inventory Management",
        text: `Hello ${user.name},\n\nWelcome to the Jumia Inventory Management system. Your account has been created successfully.\n\nEmail: ${user.email}\nRole: ${user.role}`,
        html: `
            <h2>Welcome to Jumia Inventory Management</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Your account has been created successfully.</p>
            <ul>
                <li>Email: ${user.email}</li>
                <li>Role: ${user.role}</li>
            </ul>
        `,
    });
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    isEmailEnabled,
};
