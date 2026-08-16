#!/usr/bin/env node

/**
 * BLACKSUN Email Support Setup Wizard
 * 
 * This wizard helps complete the QR code setup for donation emails
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    red: '\x1b[31m',
};

const log = {
    title: (msg) => console.log(`\n${colors.bright}${colors.blue}✦ ${msg}${colors.reset}\n`),
    success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    info: (msg) => console.log(`ℹ ${msg}`),
    section: (msg) => console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n${colors.bright}${msg}${colors.reset}\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`),
};

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function setupWizard() {
    log.section('BLACKSUN EMAIL SUPPORT SETUP WIZARD');

    log.title('Welcome!');
    console.log(`This wizard will help you set up the donation QR code feature.\n`);

    // Check current status
    const imagesDir = path.join(__dirname, 'public', 'images');
    const qrPath = path.join(imagesDir, 'minipay-qr.png');
    const qrExists = fs.existsSync(qrPath);

    log.section('Current Status');
    
    if (qrExists) {
        log.success(`QR code image found at: ${qrPath}`);
        const stats = fs.statSync(qrPath);
        log.info(`File size: ${stats.size} bytes`);
    } else {
        log.warning(`QR code image not found at: ${qrPath}`);
        log.info(`This is the next step to complete.`);
    }

    // Configuration review
    log.section('Current Configuration');
    console.log(`OPay Account:        8122911210`);
    console.log(`MiniPay Account:     +2348122911210`);
    console.log(`Minimum Donation:    ₦100`);
    console.log(`Sender Name:         BLACKSUN - inventory-management email services`);

    // Setup steps
    log.section('Setup Steps');

    console.log(`1. ${colors.bright}REVIEW FILES${colors.reset}`);
    console.log(`   ✓ config/emailConfig.js - Updated with new sender name`);
    console.log(`   ✓ services/emailService.js - Added support section`);
    console.log(`   ✓ utilities/qrcodeGenerator.js - QR code utility`);
    
    console.log(`\n2. ${colors.bright}SAVE QR CODE IMAGE${colors.reset}`);
    if (!qrExists) {
        console.log(`   ⏳ PENDING - Save your QR code image`);
        console.log(`      Location: public/images/minipay-qr.png`);
    } else {
        console.log(`   ✓ COMPLETE - QR code image found`);
    }

    console.log(`\n3. ${colors.bright}TEST REGISTRATION${colors.reset}`);
    console.log(`   ⏳ PENDING - Register a test user to verify emails`);

    // Wizard options
    log.section('Next Steps');

    console.log(`1. Save QR Code Image:`);
    console.log(`   - Extract just the QR code from your screenshot`);
    console.log(`   - Save as: public/images/minipay-qr.png`);
    console.log(`   - Format: PNG or JPG`);
    console.log(`   - Size: 300×300px to 500×500px`);

    console.log(`\n2. OR Use the Helper Script:`);
    console.log(`   node save-qrcode.js ./your-qr-image.png`);

    console.log(`\n3. Verify Setup:`);
    console.log(`   - Restart your application`);
    console.log(`   - Register a new user`);
    console.log(`   - Check the welcome email for:  `);
    console.log(`     • Support section with payment details`);
    console.log(`     • Embedded QR code`);
    console.log(`     • Sender: BLACKSUN - inventory-management email services`);

    console.log(`\n4. Customize (Optional):`);
    console.log(`   - Edit utilities/qrcodeGenerator.js to change payment details`);
    console.log(`   - Update EMAIL_FROM_NAME in .env for sender name`);
    console.log(`   - Modify email template in services/emailService.js`);

    // Helpful links
    log.section('Documentation');
    console.log(`📖 Full Documentation: EMAIL_SUPPORT_FEATURE.md`);
    console.log(`💻 Email Service: services/emailService.js`);
    console.log(`⚙️  QR Code Utility: utilities/qrcodeGenerator.js`);
    console.log(`🔧 Helper Script: save-qrcode.js`);

    // Final prompt
    const proceed = await question(
        `\n${colors.bright}Ready to proceed?${colors.reset} (yes/no): `
    );

    if (proceed.toLowerCase() === 'yes' || proceed.toLowerCase() === 'y') {
        log.success('Setup wizard complete!');
        console.log(`\nNext steps:`);
        console.log(`1. Save your QR code image to: public/images/minipay-qr.png`);
        console.log(`2. Restart your application`);
        console.log(`3. Test by registering a new user`);
        console.log(`\nFor more info, see: EMAIL_SUPPORT_FEATURE.md`);
    } else {
        console.log(`\nSetup wizard cancelled.`);
    }

    rl.close();
}

// Run the wizard
setupWizard().catch(err => {
    log.error(`Setup error: ${err.message}`);
    rl.close();
    process.exit(1);
});
