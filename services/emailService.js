const { transporter } = require("../config/emailConfig");

/**
 * Generic email sender
 */
const sendEmail = async ({ to, subject, text, html }) => {
    return transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    });
};

/**
 * Send welcome email to newly registered users
 */
const sendWelcomeEmail = async ({
    name,
    email,
    role,
    creator = "Jumia Inventory Management",
    linkedin = "#",
    supportInfo = "Please contact the system administrator for support.",
    qrUrl,
}) => {
    let roleMessage = "";
    let roleFeatures = "";

    switch ((role || "").toLowerCase()) {
        case "admin":
            roleMessage =
                "As an Admin, you have full control over the system, including managing users, roles, inventory, and advanced reports.";

            roleFeatures = `
                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3z"/>
                    </svg>
                    <p>User Management</p>
                </div>

                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M5 3h14v18H5z"/>
                    </svg>
                    <p>Advanced Reports</p>
                </div>

                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M4 4h16v16H4z"/>
                    </svg>
                    <p>Inventory Control</p>
                </div>
            `;
            break;

        case "manager":
            roleMessage =
                "As a Manager, you can oversee products, stock levels, suppliers, and inventory operations.";

            roleFeatures = `
                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M12 2l9 21H3z"/>
                    </svg>
                    <p>Supplier Management</p>
                </div>

                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M4 4h16v16H4z"/>
                    </svg>
                    <p>Stock Control</p>
                </div>

                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3z"/>
                    </svg>
                    <p>Inventory Reports</p>
                </div>
            `;
            break;

        case "staff":
            roleMessage =
                "As a Staff member, you can manage assigned products, monitor stock, and track inventory activity.";

            roleFeatures = `
                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3z"/>
                    </svg>
                    <p>Product Management</p>
                </div>

                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M5 3h14v18H5z"/>
                    </svg>
                    <p>Inventory Tracking</p>
                </div>

                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M4 4h16v16H4z"/>
                    </svg>
                    <p>Stock Updates</p>
                </div>
            `;
            break;

        default:
            roleMessage =
                "Your inventory account has been created successfully.";

            roleFeatures = `
                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3z"/>
                    </svg>
                    <p>Inventory Access</p>
                </div>

                <div class="feature">
                    <svg class="feature-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1565c0"
                        viewBox="0 0 24 24">
                        <path d="M5 3h14v18H5z"/>
                    </svg>
                    <p>Dashboard Access</p>
                </div>
            `;
    }

    return sendEmail({
        to: email,

        subject: "Welcome to Jumia Inventory Management",

        text: `
Hello ${name},

Welcome to Jumia Inventory Management.

Your account has been successfully created.

Account Details:
Name: ${name}
Email: ${email}
Role: ${role}

${roleMessage}

You can access the inventory dashboard at:
http://localhost:3000/login

If you did not create this account, please contact our support team immediately.

Jumia Inventory Management
Inventory control made simpler.
        `.trim(),

        html: `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Welcome to Jumia Inventory Management</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family:
                'Segoe UI',
                Arial,
                sans-serif;
            background: #f5f5f5;
            color: #333;
        }

        .wrapper {
            width: 100%;
            padding: 30px 15px;
            box-sizing: border-box;
        }

        .container {
            max-width: 640px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
            box-shadow:
                0 5px 20px rgba(0, 0, 0, 0.08);
        }

        .header {
            background:
                linear-gradient(
                    135deg,
                    #0d1b2a,
                    #1565c0
                );

            color: #ffffff;
            text-align: center;
            padding: 35px 25px;
        }

        .logo {
            width: 70px;
            height: 70px;
            margin: 0 auto 15px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: bold;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }

        .header p {
            margin: 8px 0 0;
            opacity: 0.85;
            font-size: 14px;
        }

        .status {
            text-align: center;
            padding: 35px 25px 20px;
        }

        .success-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            border-radius: 50%;
            background: #e8f5e9;
            color: #2e7d32;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            font-weight: bold;
        }

        .status h2 {
            margin: 0 0 10px;
            color: #0d1b2a;
            font-size: 22px;
        }

        .status p {
            margin: 8px 0;
            line-height: 1.6;
        }

        .role-message {
            color: #555;
            font-size: 14px;
            max-width: 500px;
            margin: 15px auto 0;
        }

        .card {
            background: #f9fafb;
            margin: 20px;
            padding: 22px;
            border-radius: 10px;
            border: 1px solid #e1e5e9;
        }

        .card h3 {
            margin-top: 0;
            margin-bottom: 18px;
            color: #0d1b2a;
        }

        .account-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        .account-table tr {
            border-bottom: 1px solid #e5e5e5;
        }

        .account-table tr:last-child {
            border-bottom: none;
        }

        .account-table td {
            padding: 12px 5px;
        }

        .account-table td:first-child {
            width: 35%;
            color: #666;
        }

        .role-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            background: #e3f2fd;
            color: #1565c0;
            font-weight: 600;
            text-transform: capitalize;
        }

        .button-container {
            text-align: center;
            margin: 30px 20px;
        }

        .btn {
            background: #1565c0;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 7px;
            font-weight: bold;
            font-size: 15px;
            display: inline-block;
        }

        .btn:hover {
            background: #0d47a1;
        }

        .features-title {
            text-align: center;
            color: #0d1b2a;
            margin: 30px 20px 15px;
        }

        .features-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            padding: 0 10px;
        }

        .feature {
            flex: 1 1 28%;
            min-width: 130px;
            margin: 8px;
            padding: 18px 10px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }

        .feature-icon {
            width: 32px;
            height: 32px;
            margin-bottom: 8px;
        }

        .feature p {
            margin: 5px 0 0;
            font-size: 13px;
            font-weight: 600;
            color: #333;
        }

        .note {
            background: #fff8e1;
            color: #856404;
            padding: 15px;
            font-size: 12px;
            margin: 25px 20px;
            border-radius: 7px;
            border: 1px solid #ffe082;
            line-height: 1.5;
        }

        .footer {
            background: #f1f3f5;
            text-align: center;
            padding: 22px 15px;
            font-size: 12px;
            color: #777;
        }

        .footer strong {
            color: #444;
        }

        .footer a {
            color: #1565c0;
            text-decoration: none;
        }

        .footer hr {
            margin: 15px 0;
            border: none;
            border-top: 1px solid #ddd;
        }

        .qr-container {
            margin-top: 18px;
        }

        .qr-container img {
            width: 120px;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 6px;
        }

        .qr-container p {
            font-size: 11px;
            color: #555;
            margin-top: 5px;
        }

        @media (max-width: 480px) {
            .wrapper {
                padding: 10px;
            }

            .header h1 {
                font-size: 20px;
            }

            .feature {
                flex: 1 1 100%;
            }

            .account-table td:first-child {
                width: 40%;
            }
        }
    </style>
</head>

<body>

    <div class="wrapper">

        <div class="container">

            <!-- HEADER -->

            <div class="header">

                <div class="logo">
                    J
                </div>

                <h1>
                    JUMIA INVENTORY MANAGEMENT
                </h1>

                <p>
                    Inventory Management System
                </p>

            </div>


            <!-- SUCCESS MESSAGE -->

            <div class="status">

                <div class="success-icon">
                    ✓
                </div>

                <h2>
                    Account Created Successfully
                </h2>

                <p>
                    Welcome,
                    <strong>${name}</strong>!
                </p>

                <p>
                    Your inventory management account
                    has been successfully created.
                </p>

                <p class="role-message">
                    ${roleMessage}
                </p>

            </div>


            <!-- ACCOUNT DETAILS -->

            <div class="card">

                <h3>
                    Account Details
                </h3>

                <table class="account-table">

                    <tr>
                        <td>
                            <strong>Name</strong>
                        </td>

                        <td>
                            ${name}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <strong>Email</strong>
                        </td>

                        <td>
                            ${email}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <strong>Role</strong>
                        </td>

                        <td>
                            <span class="role-badge">
                                ${role}
                            </span>
                        </td>
                    </tr>

                </table>

            </div>


            <!-- LOGIN BUTTON -->

            <div class="button-container">

                <a
                    href="http://localhost:3000/login"
                    class="btn"
                >
                    Open Inventory Dashboard
                </a>

            </div>


            <!-- FEATURES -->

            <h3 class="features-title">
                Your Available Features
            </h3>

            <div class="features-grid">

                ${roleFeatures}

            </div>


            <!-- SECURITY NOTE -->

            <div class="note">

                <strong>Security Notice</strong><br>

                If you did not create this account,
                please contact our support team
                immediately.

            </div>


            <!-- FOOTER -->

            <div class="footer">

                <p>
                    <strong>
                        Jumia Inventory Management
                    </strong>
                    <br>
                    Inventory control made simpler.
                </p>

                <hr>

                <p style="margin:0; font-size:11px; color:#555;">

                    Developed by
                    <strong>
                        ${creator}
                    </strong>

                    <br>

                    ${
                        linkedin && linkedin !== "#"
                            ? `
                                <a href="${linkedin}">
                                    Connect on LinkedIn
                                </a>
                                <br>
                            `
                            : ""
                    }

                    ${supportInfo}

                </p>


                ${
                    qrUrl
                        ? `
                            <div class="qr-container">

                                <img
                                    src="${qrUrl}"
                                    alt="MiniPay QR Code"
                                >

                                <p>
                                    Scan to support via MiniPay
                                </p>

                            </div>
                        `
                        : ""
                }

            </div>

        </div>

    </div>

</body>

</html>
        `,
    });
};


/**
 * Export email functions
 */
module.exports = {
    sendEmail,
    sendWelcomeEmail,
};