# Email Support/Donation Feature Documentation

## Overview
The email service has been enhanced to include a **Support Our Development** section in welcome emails. This section displays payment options (OPay and MiniPay) along with a QR code, allowing users to support the project with any amount starting from ₦100.

## What's Changed

### 1. **Email Sender**
- **New Sender Name**: "BLACKSUN - inventory-management email services"
- Location: `config/emailConfig.js`

### 2. **Support Section in Welcome Emails**
A beautifully styled support section now appears in every welcome email with:
- ✅ Donation message
- ✅ OPay payment option: **8122911210**
- ✅ MiniPay payment option: **+2348122911210**
- ✅ Embedded QR code for MiniPay
- ✅ Minimum donation: **₦100**

### 3. **Files Modified**

| File | Changes |
|------|---------|
| `config/emailConfig.js` | Updated default sender name |
| `services/emailService.js` | Added support section, imports QR code utility |
| `utilities/qrcodeGenerator.js` | New utility file for QR code management |
| `save-qrcode.js` | Helper script to save QR code image |

## Setup Instructions

### Step 1: Save the QR Code Image

You have two options:

#### Option A: Manual Save
1. Take a screenshot/extract the QR code from the MiniPay image
2. Crop it to show only the QR code square (remove phone number, buttons, text)
3. Save it as PNG format
4. Place it at: `public/images/minipay-qr.png`

#### Option B: Use Helper Script
```bash
node save-qrcode.js ./your-qr-image.png
```

### Step 2: Verify Setup
```bash
# The following file should exist after setup:
ls public/images/minipay-qr.png
```

### Step 3: Test
Register a new user and check the welcome email to see:
- Support section with payment details
- Embedded QR code (if image was saved)
- Proper sender name "BLACKSUN - inventory-management email services"

## File Structure

```
project-root/
├── config/
│   └── emailConfig.js (updated)
├── services/
│   └── emailService.js (updated)
├── utilities/
│   ├── qrcodeGenerator.js (new)
│   └── ...
├── public/
│   └── images/
│       └── minipay-qr.png (to be added)
├── save-qrcode.js (helper script)
└── ...
```

## Usage Examples

### Using in Controllers
```javascript
const { sendWelcomeEmail, getPaymentInfo } = require('../services/emailService');

// Send welcome email with automatic QR code
await sendWelcomeEmail({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'manager',
    creator: 'Your Company',
    linkedin: 'https://linkedin.com/...'
});

// Get payment information
const payment = getPaymentInfo();
console.log(payment.opay);    // 8122911210
console.log(payment.minipay); // +2348122911210
```

### Checking QR Code Status
```javascript
const qrcodeGen = require('../utilities/qrcodeGenerator');

if (qrcodeGen.qrCodeExists()) {
    console.log('QR code is ready:', qrcodeGen.getQRCodePath());
} else {
    console.log('Please save QR code image to:', qrcodeGen.getQRCodePath());
}
```

## Email Features

### Support Section Styling
- 🎨 Gradient background (yellow/orange)
- 💚 Heart emoji for friendliness
- 📱 Two-column payment options
- 🔲 Centered QR code image
- 📝 Helpful donation message

### Payment Options Displayed
```
OPay: 8122911210
MiniPay: +2348122911210
Min Amount: ₦100
```

## QR Code Requirements

If you want the QR code to appear properly in emails:

| Requirement | Details |
|------------|---------|
| Format | PNG (JPG also works) |
| Size | 300×300px to 500×500px |
| Background | White/Light |
| Code | Black/Dark |
| Cropping | Only QR code square |
| Location | `public/images/minipay-qr.png` |

## Environment Variables (Optional)

You can customize the sender name in `.env`:
```env
EMAIL_FROM_NAME=BLACKSUN - inventory-management email services
```

If not set, the default is used from `config/emailConfig.js`.

## Troubleshooting

### QR Code Not Appearing?
1. Check if `public/images/minipay-qr.png` exists
2. Verify the file is a valid image format
3. Check browser console for loading errors
4. Some email clients may block embedded images

### Email Not Sending?
1. Verify SMTP credentials in `.env`
2. Check email service logs
3. Ensure sender address is correct
4. Test with `test-email.js` if available

### Styling Issues?
1. Email clients render CSS differently
2. Test in multiple email clients (Gmail, Outlook, Apple Mail, etc.)
3. Most styles are inline for compatibility
4. Some email clients strip certain CSS features

## Future Enhancements

Potential improvements:
- [ ] Multiple payment gateway integration
- [ ] Dynamic QR code generation
- [ ] Payment tracking system
- [ ] Donation receipt emails
- [ ] Analytics/reporting for donations
- [ ] Custom donation amounts in email

## Support

For issues or customization:
1. Check this documentation
2. Review the code comments in the affected files
3. Test with a new user registration
4. Check email client compatibility

---

**Version**: 1.0  
**Last Updated**: 2026-08-16  
**Sender**: BLACKSUN - inventory-management email services
