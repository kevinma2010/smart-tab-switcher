const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SIZES = [16, 32, 48, 128];
const UI_ICON_SIZE = 48;

async function generateExtensionIcons() {
  const extensionIconSvg = fs.readFileSync(
    path.join(__dirname, '../src/icons/extension-icon.svg')
  );

  // 确保目录存在
  const extensionDir = path.join(__dirname, '../src/icons/extension');
  if (!fs.existsSync(extensionDir)) {
    fs.mkdirSync(extensionDir, { recursive: true });
  }

  // 生成不同尺寸的图标
  for (const size of SIZES) {
    await sharp(Buffer.from(extensionIconSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(extensionDir, `icon-${size}.png`));
  }
}

async function generateUiIcons() {
  const uiDir = path.join(__dirname, '../src/icons/ui');
  if (!fs.existsSync(uiDir)) {
    fs.mkdirSync(uiDir, { recursive: true });
  }

  const uiIcons = [
    'tab',
    'bookmark',
    'google',
    'globe',
    'default'
  ];

  for (const icon of uiIcons) {
    const svg = fs.readFileSync(
      path.join(__dirname, `../src/icons/${icon}-icon.svg`)
    );

    await sharp(Buffer.from(svg))
      .resize(UI_ICON_SIZE, UI_ICON_SIZE)
      .png()
      .toFile(path.join(uiDir, `${icon}.png`));
  }
}

async function main() {
  try {
    await generateExtensionIcons();
    await generateUiIcons();
    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();