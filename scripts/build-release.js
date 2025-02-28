const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('../package.json');

const { version } = packageJson;

// Ensure the release directory exists
const releaseDir = path.join(__dirname, '../release');
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir);
}

// Clean up old release files
fs.readdirSync(releaseDir).forEach(file => {
  fs.unlinkSync(path.join(releaseDir, file));
});

// Build the extension
console.log('Building extension...');
execSync('npm run build', { stdio: 'inherit' });

// Create zip files for both browsers
console.log('\nCreating release packages...');
['chrome', 'firefox'].forEach(browser => {
  const distDir = path.join(__dirname, '../dist', browser);
  const zipFile = path.join(releaseDir, `smart-tab-switcher-${browser}-v${version}.zip`);
  
  // Create zip file
  const command = process.platform === 'win32'
    ? `cd "${distDir}" && 7z a -tzip "${zipFile}" ./*`
    : `cd "${distDir}" && zip -r "${zipFile}" .`;
  
  execSync(command, { stdio: 'inherit' });
  console.log(`Created ${browser} package: ${path.basename(zipFile)}`);
});

console.log('\nRelease packages created successfully! 🎉');
console.log('Location:', releaseDir);
console.log('\nFiles created:');
fs.readdirSync(releaseDir).forEach(file => {
  console.log(`- ${file}`);
}); 