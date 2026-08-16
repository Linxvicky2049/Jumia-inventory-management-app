const fs = require('fs');
const path = require('path');

/**
 * Get QR Code image as data URL or file path
 * 
 * This utility manages the MiniPay QR code for support/donation emails
 * 
 * Payment Details:
 * - OPay: 8122911210
 * - MiniPay: +2348122911210
 */

const qrCodePath = path.join(__dirname, '../public/images/minipay-qr.png');

/**
 * Get QR code as data URL (embedded in email)
 * @returns {string|null} Base64 data URL or null if file doesn't exist
 */
const getQRCodeDataURL = () => {
    try {
        if (fs.existsSync(qrCodePath)) {
            const imageBuffer = fs.readFileSync(qrCodePath);
            const base64 = imageBuffer.toString('base64');
            return `data:image/png;base64,${base64}`;
        }
        return null;
    } catch (error) {
        console.error('Error reading QR code image:', error.message);
        return null;
    }
};

/**
 * Get QR code as file path (for reference)
 * @returns {string} File path to QR code
 */
const getQRCodePath = () => {
    return qrCodePath;
};

/**
 * Check if QR code file exists
 * @returns {boolean}
 */
const qrCodeExists = () => {
    return fs.existsSync(qrCodePath);
};

/**
 * Get payment information object
 * @returns {object} Payment details
 */
const getPaymentInfo = () => {
    return {
        opay: '8122911210',
        minipay: '+2348122911210',
        minAmount: 100,
        currency: '₦',
        description: 'Support our inventory management system development'
    };
};

module.exports = {
    getQRCodeDataURL,
    getQRCodePath,
    qrCodeExists,
    getPaymentInfo,
};
