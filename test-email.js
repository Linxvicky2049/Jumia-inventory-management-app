require("dotenv").config();

const { verifyEmailConnection } = require("./config/emailConfig");
const { sendEmail } = require("./services/emailService");

const testEmail = async () => {
    try {
        const connected = await verifyEmailConnection();

        if (!connected) {
            console.log("❌ Email configuration failed.");
            process.exit(1);
        }

        await sendEmail({
            to: "victor4all2015@gmail.com",
            subject: "Jumia Inventory Management - Test Email",
            text: "Your Jumia Inventory Management email system is working.",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h1>Email System Working</h1>

                    <p>
                        Congratulations! Your Jumia Inventory Management
                        email service is successfully connected to Brevo.
                    </p>

                    <p>
                        This is a test email from your Node.js application.
                    </p>

                    <hr>

                    <p>
                        <strong>Jumia Inventory Management</strong>
                    </p>
                </div>
            `,
        });

        console.log("✅ Test email sent successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Test email failed:");
        console.error(error.message);
        process.exit(1);
    }
};

testEmail();