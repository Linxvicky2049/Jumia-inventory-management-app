const { transporter } = require("../config/emailConfig");


const sendWelcomeEmail = async ({ name, email, role, creator, linkedin, supportInfo, qrUrl }) => {
    let roleMessage = "";
    let roleFeatures = "";

    switch ((role || "").toLowerCase()) {
        case "admin":
            roleMessage = "As an Admin, you have full control over the system, including managing users, roles, and advanced reports.";
            roleFeatures = `
                <div class="feature"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="#1565c0" viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/></svg><p>User Management</p></div>
                <div class="feature"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="#1565c0" viewBox="0 0 24 24"><path d="M5 3h14v18H5z"/></svg><p>Advanced Reports</p></div>
            `;
            break;
        case "manager":
            roleMessage = "As a Manager, you can oversee products, stock levels, and supplier relationships.";
            roleFeatures = `
                <div class="feature"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="#1565c0" viewBox="0 0 24 24"><path d="M12 2l9 21H3z"/></svg><p>Supplier Management</p></div>
                <div class="feature"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="#1565c0" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg><p>Stock Control</p></div>
            `;
            break;
        default:
            roleMessage = "As a User, you can manage your assigned products and track inventory activity.";
            roleFeatures = `
                <div class="feature"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="#1565c0" viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/></svg><p>Products</p></div>
                <div class="feature"><svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="#1565c0" viewBox="0 0 24 24"><path d="M5 3h14v18H5z"/></svg><p>Reports</p></div>
            `;
    }

    return sendEmail({
        to: email,
        subject: "Welcome to Jumia Inventory Management",
        text: `Hello ${name}, welcome to Jumia Inventory Management.`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background:#f5f5f5; }
                .container { max-width:640px; margin:auto; background:#fff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0; }
                .header { background:#0d1b2a; color:#fff; text-align:center; padding:25px; }
                .status { text-align:center; padding:30px 20px; }
                .card { background:#f9f9f9; margin:20px; padding:20px; border-radius:6px; border:1px solid #ddd; }
                .btn { background:#1565c0; color:#fff; text-decoration:none; padding:14px 28px; border-radius:4px; font-weight:bold; font-size:15px; display:inline-block; }
                .features-grid { display:flex; flex-wrap:wrap; justify-content:space-around; }
                .feature { flex:1 1 40%; margin:10px; text-align:center; }
                .feature-icon { width:32px; height:32px; margin-bottom:8px; }
                .note { background:#fff3cd; color:#856404; padding:15px; font-size:12px; margin:0 20px 20px 20px; border-radius:4px; border:1px solid #ffeeba; }
                .footer { background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777; }
                .footer a { color:#1565c0; text-decoration:none; }
                @media (max-width:480px) { .features-grid { flex-direction:column; } .feature { flex:1 1 100%; } }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>JUMIA INVENTORY MANAGEMENT</h1>
                    <p>Inventory System</p>
                </div>

                <div class="status">
                    <h2>Account Created Successfully</h2>
                    <p>Welcome, ${name}! Your account has been successfully created.</p>
                    <p style="color:#444; font-size:14px;">${roleMessage}</p>
                </div>

                <div class="card">
                    <h3>Account Details</h3>
                    <table style="width:100%; font-size:14px; color:#333;">
                        <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
                        <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                        <tr><td><strong>Role:</strong></td><td>${role}</td></tr>
                    </table>
                </div>

                <div style="text-align:center; margin:30px 0;">
                    <a href="http://localhost:3000/login" class="btn">Open Inventory Dashboard</a>
                </div>

                <div class="features-grid">
                    ${roleFeatures}
                </div>

                <div class="note">
                    If you did not create this account, please contact our support team immediately.
                </div>

                <div class="footer">
                    <p><strong>Jumia Inventory Management</strong><br>Inventory control made simpler.</p>
                    <hr style="margin:15px 0; border:none; border-top:1px solid #ddd;">
                    <p style="margin:0; font-size:11px; color:#555;">
                        Developed by <strong>${creator}</strong><br>
                        <a href="${linkedin}">Connect on LinkedIn</a><br>
                        ${supportInfo}
                    </p>
                    ${qrUrl ? `
                    <div style="margin-top:15px;">
                        <img src="${qrUrl}" alt="MiniPay QR Code" style="width:120px; height:auto; border:1px solid #ddd; border-radius:6px;">
                        <p style="font-size:11px; color:#555; margin-top:5px;">Scan to support via MiniPay</p>
                    </div>` : ""}
                </div>
            </div>
        </body>
        </html>
        `
    });
};
