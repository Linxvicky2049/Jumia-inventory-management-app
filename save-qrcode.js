/**
 * QR Code Image Setup Helper
 * 
 * This script helps save the MiniPay QR code image to the public/images folder
 * 
 * Usage: node save-qrcode.js <path-to-qr-image>
 * Example: node save-qrcode.js ./minipay-qr.png
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║          QR Code Image Setup Instructions                      ║
╚════════════════════════════════════════════════════════════════╝

To enable the QR code in your support emails:

1. SAVE THE QR CODE IMAGE:
   - Take a screenshot of just the QR code (without the phone number/buttons)
   - Save it as "minipay-qr.png" in the public/images folder
   - Make sure it's a clean, cropped PNG image

2. LOCATION:
   File path: public/images/minipay-qr.png

3. IMAGE REQUIREMENTS:
   - Format: PNG (recommended) or JPG
   - Size: 300x300px to 500x500px (for email compatibility)
   - Quality: High contrast (white background, black QR code)
   - Cropped: Only the QR code square, no borders or text

4. COPY FROM SCREENSHOT:
   - The QR code in your screenshot shows the MiniPay payment details
   - Crop only the green and black QR code square
   - Remove the phone number, buttons, and other text

5. ALTERNATIVELY:
   Run: node save-qrcode.js <path-to-your-qr-image>
   Example: node save-qrcode.js ./minipay-qr.png

╔════════════════════════════════════════════════════════════════╗
║          Configuration Details                                 ║
╚════════════════════════════════════════════════════════════════╝

Current Payment Configuration:
- OPay: 8122911210
- MiniPay: +2348122911210
- Minimum Donation: ₦100
- Sender: BLACKSUN - inventory-management email services

The QR code will be automatically embedded in:
✓ Welcome emails for new users
✓ Support/donation section with payment options
✓ Base64 encoded for universal email client compatibility

Once you save the image, restart your application and the QR code
will appear in all welcome emails with the support section.

    `);
    process.exit(0);
}

const sourcePath = args[0];
const destDir = path.join(__dirname, 'public', 'images');
const destPath = path.join(destDir, 'minipay-qr.png');

// Check if source file exists
if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Error: Source file not found: ${sourcePath}`);
    process.exit(1);
}

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`✓ Created directory: ${destDir}`);
}

// Copy the file
try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ QR Code image saved successfully!`);
    console.log(`  Location: ${destPath}`);
    console.log(`  Size: ${fs.statSync(destPath).size} bytes`);
    console.log(`\n✓ The QR code will now appear in welcome emails.`);
    console.log(`  Restart your application to apply changes.`);
} catch (error) {
    console.error(`❌ Error copying file: ${error.message}`);
    process.exit(1);
}
