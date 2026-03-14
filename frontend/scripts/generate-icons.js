 
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateIcons() {
  const inputImage = path.join(__dirname, '../public/raw_logo.png');
  const appDir = path.join(__dirname, '../src/app');
  const publicDir = path.join(__dirname, '../public');

  if (!fs.existsSync(inputImage)) {
    console.error('Input image not found:', inputImage);
    process.exit(1);
  }

  // Generate standard Next.js App Router icons
  
  // 1. icon.png (used as standard favicon, Next.js handles it)
  await sharp(inputImage)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(appDir, 'icon.png'));
  console.log('Generated src/app/icon.png');

  // 2. apple-icon.png
  await sharp(inputImage)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));
  console.log('Generated src/app/apple-icon.png');

  // 3. Main logo.png for UI (like Navbar)
  await sharp(inputImage)
    .resize({ width: 512, withoutEnlargement: true })
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('Generated public/logo.png');
}

generateIcons().catch(console.error);
