#!/usr/bin/env node

/**
 * MiniPay QR Code Cropper
 * Crops the QR code from a screenshot and saves it to public/images/
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║             MiniPay QR Code Image Cropper                      ║
╚════════════════════════════════════════════════════════════════╝

Usage:
  node crop-qrcode.js <image-path> [left] [top] [width] [height]

Examples:
  # Crop with automatic detection (simple)
  node crop-qrcode.js ./screenshot.png

  # Crop with custom coordinates (advanced)
  node crop-qrcode.js ./screenshot.png 130 340 360 360

Parameters:
  image-path  : Path to your screenshot file
  left        : Left position (default: auto-detect)
  top         : Top position (default: auto-detect)
  width       : Crop width (default: 360)
  height      : Crop height (default: 360)

The cropped image will be saved to:
  public/images/minipay-qr.png

    `);
    process.exit(0);
}

const imagePath = args[0];
const left = parseInt(args[1]) || 130;
const top = parseInt(args[2]) || 340;
const width = parseInt(args[3]) || 360;
const height = parseInt(args[4]) || 360;

const outputDir = path.join(__dirname, 'public', 'images');
const outputPath = path.join(outputDir, 'minipay-qr.png');

// Verify input file exists
if (!fs.existsSync(imagePath)) {
    console.error(`❌ Error: Image file not found: ${imagePath}`);
    process.exit(1);
}

// Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✓ Created directory: ${outputDir}`);
}

// Crop and save the image
async function cropImage() {
    try {
        console.log(`\nProcessing image: ${imagePath}`);
        console.log(`Crop region: ${left}, ${top}, ${width}×${height}`);
        console.log(`Output: ${outputPath}\n`);

        await sharp(imagePath)
            .extract({ left, top, width, height })
            .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        console.log(`✓ Successfully cropped and saved!`);
        console.log(`  File: ${outputPath}`);
        console.log(`  Size: ${stats.size} bytes`);
        console.log(`  Dimensions: ${width}×${height} pixels\n`);
        console.log(`✓ QR code is now ready to use in emails!`);
        console.log(`  Restart your application to activate.\n`);
        
    } catch (error) {
        console.error(`❌ Error processing image: ${error.message}`);
        process.exit(1);
    }
}

cropImage();
