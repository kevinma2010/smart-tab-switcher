#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options });
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    throw error;
  }
}

async function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

async function updateVersion(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
}

async function getNextVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return type; // Custom version
  }
}

async function updateChangelog(version) {
  const changelogPath = 'CHANGELOG.md';
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  
  const today = new Date().toISOString().split('T')[0];
  
  // Replace ## [Unreleased] with ## [version] - date
  const updatedChangelog = changelog.replace(
    /## \[Unreleased\]/,
    `## [Unreleased]\n\n## [${version}] - ${today}`
  );
  
  fs.writeFileSync(changelogPath, updatedChangelog);
}

async function extractReleaseNotes(version) {
  const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
  
  // Extract content between version header and next version/section
  const versionPattern = new RegExp(`## \\[${version}\\][^#]*`, 's');
  const match = changelog.match(versionPattern);
  
  if (match) {
    return match[0]
      .replace(/## \[.*?\] - \d{4}-\d{2}-\d{2}/, '')
      .trim();
  }
  
  return '';
}

async function generateStoreReleaseNotes(version, changelogContent) {
  const templatePath = 'store-assets/release-notes-template.md';
  
  if (!fs.existsSync(templatePath)) {
    console.log('⚠️  Release notes template not found, skipping store notes generation');
    return;
  }
  
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Parse changelog content
  const sections = {
    added: [],
    changed: [],
    fixed: [],
    security: [],
    removed: [],
    deprecated: []
  };
  
  const lines = changelogContent.split('\n');
  let currentSection = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('### Added')) currentSection = 'added';
    else if (trimmed.startsWith('### Changed')) currentSection = 'changed';
    else if (trimmed.startsWith('### Fixed')) currentSection = 'fixed';
    else if (trimmed.startsWith('### Security')) currentSection = 'security';
    else if (trimmed.startsWith('### Removed')) currentSection = 'removed';
    else if (trimmed.startsWith('### Deprecated')) currentSection = 'deprecated';
    else if (trimmed.startsWith('- ') && currentSection) {
      sections[currentSection].push(trimmed.substring(2));
    }
  }
  
  // Generate summaries
  const newFeatures = sections.added.length > 0 ? sections.added.join('\n- ') : 'Bug fixes and improvements';
  const improvements = [...sections.changed, ...sections.fixed].join('\n- ') || 'Performance and stability improvements';
  const codeChanges = sections.added.concat(sections.changed, sections.fixed)
    .map(item => `   - ${item}`).join('\n') || '   - General improvements and bug fixes';
  
  // Replace template variables
  let chromeNotes = template.split('## Firefox Add-ons Release Notes Template')[0];
  let firefoxNotes = template.split('## Firefox Add-ons Release Notes Template')[1] || template;
  
  const replacements = {
    '{{VERSION}}': version,
    '{{CHANGELOG_CONTENT}}': changelogContent,
    '{{AUTO_GENERATED_SUMMARY}}': improvements,
    '{{NEW_FEATURES_SUMMARY}}': `- ${newFeatures}`,
    '{{IMPROVEMENTS_SUMMARY}}': improvements,
    '{{UPDATE_SUMMARY}}': sections.added.length > 0 ? 'adds new features and improvements' : 'includes bug fixes and improvements',
    '{{CODE_CHANGES_SUMMARY}}': codeChanges,
    '{{TESTING_INSTRUCTIONS}}': sections.added.length > 0 ? 
      '   - Test the new features mentioned above\n   - Verify existing functionality remains intact' :
      '   - Verify all existing functionality works correctly\n   - Test performance improvements'
  };
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    chromeNotes = chromeNotes.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    firefoxNotes = firefoxNotes.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  
  // Write Chrome Web Store notes
  fs.writeFileSync(`docs/chrome-webstore-submission.md`, 
    `# Chrome Web Store Submission Notes\n\n${chromeNotes.trim()}\n`);
  
  // Write Firefox Add-ons notes
  fs.writeFileSync(`docs/firefox-addon-submission.md`, 
    `# Firefox Add-ons Submission Notes\n\n${firefoxNotes.trim()}\n`);
  
  console.log('📝 Generated store-specific release notes');
}

async function main() {
  try {
    console.log('🚀 Smart Tab Switcher Release Script\n');
    
    // Check if we're on main branch
    const currentBranch = exec('git branch --show-current').trim();
    if (currentBranch !== 'main') {
      console.error('❌ Error: You must be on the main branch to create a release');
      process.exit(1);
    }
    
    // Check for uncommitted changes
    const gitStatus = exec('git status --porcelain');
    if (gitStatus.trim()) {
      console.error('❌ Error: You have uncommitted changes. Please commit or stash them first.');
      console.log('\nUncommitted changes:');
      console.log(gitStatus);
      process.exit(1);
    }
    
    // Get current version
    const currentVersion = await getCurrentVersion();
    console.log(`Current version: ${currentVersion}`);
    
    // Ask for version bump type
    const versionType = await question(
      '\nSelect version bump type:\n' +
      '  1) patch (bug fixes)\n' +
      '  2) minor (new features)\n' +
      '  3) major (breaking changes)\n' +
      '  4) custom version\n' +
      'Enter your choice (1-4): '
    );
    
    let newVersion;
    switch (versionType) {
      case '1':
        newVersion = await getNextVersion(currentVersion, 'patch');
        break;
      case '2':
        newVersion = await getNextVersion(currentVersion, 'minor');
        break;
      case '3':
        newVersion = await getNextVersion(currentVersion, 'major');
        break;
      case '4':
        newVersion = await question('Enter custom version (e.g., 1.4.0): ');
        break;
      default:
        console.error('Invalid choice');
        process.exit(1);
    }
    
    console.log(`\nNew version will be: ${newVersion}`);
    
    // Check if CHANGELOG has unreleased content
    const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
    const unreleasedMatch = changelog.match(/## \[Unreleased\]\s*\n\n## /);
    if (unreleasedMatch) {
      console.error('\n❌ Error: No changes found in CHANGELOG.md under [Unreleased] section');
      console.error('Please add your changes to CHANGELOG.md before releasing');
      process.exit(1);
    }
    
    // Confirm release
    const confirm = await question(
      '\nThis will:\n' +
      `  1. Update version to ${newVersion}\n` +
      '  2. Update CHANGELOG.md\n' +
      '  3. Commit changes\n' +
      '  4. Create git tag\n' +
      '  5. Build release packages\n' +
      '  6. Create GitHub release\n' +
      '\nProceed? (y/N): '
    );
    
    if (confirm.toLowerCase() !== 'y') {
      console.log('Release cancelled');
      process.exit(0);
    }
    
    console.log('\n📝 Updating version...');
    await updateVersion(newVersion);
    
    console.log('📝 Updating CHANGELOG...');
    await updateChangelog(newVersion);
    
    console.log('📝 Generating store release notes...');
    const releaseNotes = await extractReleaseNotes(newVersion);
    await generateStoreReleaseNotes(newVersion, releaseNotes);
    
    console.log('💾 Committing changes...');
    exec('git add package.json CHANGELOG.md docs/chrome-webstore-submission.md docs/firefox-addon-submission.md');
    exec(`git commit -m "chore: release v${newVersion}"`);
    
    console.log('🏷️  Creating git tag...');
    const tagMessage = `Release v${newVersion}\n\n${releaseNotes}`;
    exec(`git tag -a v${newVersion} -m "${tagMessage}"`);
    
    console.log('📦 Building release packages...');
    exec('npm run build:release', { stdio: 'inherit' });
    
    console.log('🚀 Creating GitHub release...');
    const releaseTitle = `v${newVersion}`;
    const releaseBody = `## What's New in v${newVersion}\n\n${releaseNotes}\n\n` +
      '### 📦 Downloads\n\n' +
      'Download the appropriate package for your browser below and install it manually, or get it from the ' +
      '[Chrome Web Store](https://chromewebstore.google.com/detail/smart-tab-switcher/jhbdhffnpfmnldkfhmhddlkmgojhajol).\n\n' +
      '---\n\n' +
      `**Full Changelog**: https://github.com/kevinma2010/smart-tab-switcher/compare/v${currentVersion}...v${newVersion}`;
    
    const chromeZip = `release/smart-tab-switcher-chrome-v${newVersion}.zip`;
    const firefoxZip = `release/smart-tab-switcher-firefox-v${newVersion}.zip`;
    
    // Create GitHub release
    exec(`gh release create v${newVersion} ` +
      `--title "${releaseTitle}" ` +
      `--notes "${releaseBody}" ` +
      `"${chromeZip}" "${firefoxZip}"`);
    
    console.log('\n✅ Release created successfully!');
    console.log(`\nGitHub Release: https://github.com/kevinma2010/smart-tab-switcher/releases/tag/v${newVersion}`);
    
    // Ask if user wants to push
    const pushConfirm = await question('\nPush tag to origin? (y/N): ');
    if (pushConfirm.toLowerCase() === 'y') {
      console.log('Pushing changes...');
      exec('git push origin main');
      await exec(`git push origin v${newVersion}`);
      console.log('✅ Pushed successfully!');
    }
    
    console.log('\n🎉 Release process completed!');
    console.log('\nNext steps:');
    console.log('1. Upload to Chrome Web Store: https://chrome.google.com/webstore/devconsole');
    console.log('2. Upload to Firefox Add-ons: https://addons.mozilla.org/developers/');
    
  } catch (error) {
    console.error('\n❌ Release failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();