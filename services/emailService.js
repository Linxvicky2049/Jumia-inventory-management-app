const { transporter } = require("../config/emailConfig");
const sendWelcomeEmail = async ({ name, email }) => {
    return sendEmail({
        to: email,
        subject: "Welcome to Jumia Inventory Management",
        text: `Hello ${name}, welcome to Jumia Inventory Management.`,
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin:auto; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <div style="background:#0d1b2a; color:#fff; text-align:center; padding:25px;">
                <h1 style="margin:0; font-size:22px;">JUMIA INVENTORY MANAGEMENT</h1>
                <p style="margin:0; font-size:14px;">Inventory System</p>
            </div>

            <!-- Hero -->
            <div style="text-align:center; padding:30px 20px;">
                <div style="font-size:48px; color:#2e7d32;">✓</div>
                <h2 style="margin:10px 0; color:#0d1b2a;">Account Created Successfully</h2>
                <p style="color:#444; font-size:15px;">Welcome, ${name}! Your account has been successfully created.</p>
            </div>

            <!-- Account Details Card -->
            <div style="background:#f9f9f9; margin:20px; padding:20px; border-radius:6px; border:1px solid #ddd;">
                <h3 style="margin-top:0; color:#0d1b2a;">Account Details</h3>
                <table style="width:100%; font-size:14px; color:#333;">
                    <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                    <tr><td><strong>Role:</strong></td><td>Manager</td></tr>
                </table>
            </div>

            <!-- Dashboard Button -->
            <div style="text-align:center; margin:30px 0;">
                <a href="http://localhost:3000/login" 
                   style="background:#1565c0; color:#fff; text-decoration:none; padding:14px 28px; border-radius:4px; font-weight:bold; font-size:15px; display:inline-block;">
                   Open Inventory Dashboard
                </a>
            </div>

            <!-- Features Grid -->
            <div style="padding:0 20px 30px 20px; text-align:center; color:#555;">
                <p style="margin-bottom:20px;">Manage your products, stock, suppliers and reports with ease.</p>
                <table style="width:100%; text-align:center; font-size:14px;">
                    <tr>
                        <td>📦<br>Products</td>
                        <td>📊<br>Stock</td>
                    </tr>
                    <tr>
                        <td>🤝<br>Suppliers</td>
                        <td>📑<br>Reports</td>
                    </tr>
                </table>
            </div>

            <!-- Security Note -->
            <div style="background:#fff3cd; color:#856404; padding:15px; font-size:12px; margin:0 20px 20px 20px; border-radius:4px; border:1px solid #ffeeba;">
                If you did not create this account, please contact our support team immediately.
            </div>

            <!-- Footer -->
            <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
                <p style="margin:0;"><strong>Jumia Inventory Management</strong></p>
                <p style="margin:0;">Inventory control made simpler.</p>
                <hr style="margin:15px 0; border:none; border-top:1px solid #ddd;">
                <p style="margin:0; font-size:11px; color:#555;">
                    Developed by <strong>Blacksun</strong>  
                    <br>
                    <a href="https://www.linkedin.com/in/somto-victor-2717783b4/" style="color:#1565c0; text-decoration:none;">Connect on LinkedIn</a>
                    <br>
                    Support independent development: OPAY (NGN) 8122911210
                </p>
            </div>
        </div>
        `,
    });
};
