#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    return null;
  }
}

function checkRequirements() {
  console.log('🔍 Checking release requirements...\n');
  
  const checks = [];
  
  // Check git is installed
  const gitVersion = exec('git --version');
  if (!gitVersion) {
    checks.push({ pass: false, message: '❌ Git is not installed' });
  } else {
    checks.push({ pass: true, message: '✅ Git is installed' });
  }
  
  // Check gh CLI is installed
  const ghVersion = exec('gh --version');
  if (!ghVersion) {
    checks.push({ pass: false, message: '❌ GitHub CLI (gh) is not installed. Install from: https://cli.github.com/' });
  } else {
    checks.push({ pass: true, message: '✅ GitHub CLI is installed' });
  }
  
  // Check if on main branch
  const currentBranch = exec('git branch --show-current');
  if (currentBranch && currentBranch.trim() !== 'main') {
    checks.push({ pass: false, message: `❌ Not on main branch (current: ${currentBranch.trim()})` });
  } else {
    checks.push({ pass: true, message: '✅ On main branch' });
  }
  
  // Check for uncommitted changes
  const gitStatus = exec('git status --porcelain');
  if (gitStatus && gitStatus.trim()) {
    checks.push({ pass: false, message: '❌ Uncommitted changes found' });
    console.log('\nUncommitted files:');
    console.log(gitStatus);
  } else {
    checks.push({ pass: true, message: '✅ Working directory is clean' });
  }
  
  // Check if remote is up to date
  exec('git fetch origin main');
  const behind = exec('git rev-list HEAD..origin/main --count');
  if (behind && parseInt(behind.trim()) > 0) {
    checks.push({ pass: false, message: `❌ Local branch is ${behind.trim()} commits behind origin/main` });
  } else {
    checks.push({ pass: true, message: '✅ Up to date with origin/main' });
  }
  
  // Check CHANGELOG has unreleased content
  try {
    const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
    const unreleasedSection = changelog.match(/## \[Unreleased\]\s*\n(.*?)(?=##|$)/s);
    
    if (!unreleasedSection || !unreleasedSection[1].trim()) {
      checks.push({ pass: false, message: '❌ No changes in CHANGELOG.md [Unreleased] section' });
    } else {
      checks.push({ pass: true, message: '✅ CHANGELOG.md has unreleased changes' });
    }
  } catch (error) {
    checks.push({ pass: false, message: '❌ Could not read CHANGELOG.md' });
  }
  
  // Check package.json exists
  if (!fs.existsSync('package.json')) {
    checks.push({ pass: false, message: '❌ package.json not found' });
  } else {
    checks.push({ pass: true, message: '✅ package.json exists' });
  }
  
  // Check build commands work
  console.log('\n🔨 Testing build process...');
  const buildTest = exec('npm run type-check');
  if (buildTest === null) {
    checks.push({ pass: false, message: '❌ Type checking failed' });
  } else {
    checks.push({ pass: true, message: '✅ Type checking passed' });
  }
  
  // Check if pnpm is installed (required for build)
  const pnpmVersion = exec('pnpm --version');
  if (!pnpmVersion) {
    checks.push({ pass: false, message: '❌ pnpm is not installed (required for builds)' });
  } else {
    checks.push({ pass: true, message: '✅ pnpm is installed' });
  }
  
  // Check store documentation version consistency
  console.log('\n🔍 Checking store documentation versions...');
  const packageVersion = getPackageVersion();
  const storeVersionChecks = checkStoreVersionConsistency(packageVersion);
  checks.push(...storeVersionChecks);
  
  return checks;
}

function displayChecklist() {
  console.log('\n📋 Pre-release Checklist:\n');
  
  const checklist = [
    '[ ] Review all changes since last release',
    '[ ] Update CHANGELOG.md with all changes under [Unreleased]',
    '[ ] Test extension in Chrome',
    '[ ] Test extension in Firefox',
    '[ ] Verify all features work correctly',
    '[ ] Check for console errors',
    '[ ] Update documentation if needed',
    '[ ] Review dependencies for security updates',
    '[ ] Ensure screenshots are up to date (if UI changed)',
  ];
  
  checklist.forEach(item => console.log(`   ${item}`));
}

function getPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    return null;
  }
}

function checkStoreVersionConsistency(currentVersion) {
  const checks = [];
  
  if (!currentVersion) {
    checks.push({ pass: false, message: '❌ Could not read version from package.json' });
    return checks;
  }
  
  // Check Chrome Web Store submission notes
  try {
    const chromeNotes = fs.readFileSync('docs/chrome-webstore-submission.md', 'utf8');
    const chromeVersionMatch = chromeNotes.match(/Version\s+(\d+\.\d+\.\d+)/i);
    
    if (chromeVersionMatch) {
      const chromeVersion = chromeVersionMatch[1];
      if (chromeVersion === currentVersion) {
        checks.push({ pass: true, message: `✅ Chrome Web Store notes version matches (${chromeVersion})` });
      } else {
        checks.push({ pass: false, message: `❌ Chrome Web Store notes version mismatch (${chromeVersion} vs ${currentVersion})` });
      }
    } else {
      checks.push({ pass: false, message: '❌ Could not find version in Chrome Web Store notes' });
    }
  } catch (error) {
    checks.push({ pass: false, message: '❌ Could not read Chrome Web Store submission notes' });
  }
  
  // Check Firefox Add-ons submission notes
  try {
    const firefoxNotes = fs.readFileSync('docs/firefox-addon-submission.md', 'utf8');
    const firefoxVersionMatch = firefoxNotes.match(/Version\s+(\d+\.\d+\.\d+)/i);
    
    if (firefoxVersionMatch) {
      const firefoxVersion = firefoxVersionMatch[1];
      if (firefoxVersion === currentVersion) {
        checks.push({ pass: true, message: `✅ Firefox Add-ons notes version matches (${firefoxVersion})` });
      } else {
        checks.push({ pass: false, message: `❌ Firefox Add-ons notes version mismatch (${firefoxVersion} vs ${currentVersion})` });
      }
    } else {
      checks.push({ pass: false, message: '❌ Could not find version in Firefox Add-ons notes' });
    }
  } catch (error) {
    checks.push({ pass: false, message: '❌ Could not read Firefox Add-ons submission notes' });
  }
  
  return checks;
}

function main() {
  console.log('🚀 Smart Tab Switcher - Pre-release Check\n');
  
  const checks = checkRequirements();
  
  console.log('\n📊 Results:\n');
  checks.forEach(check => console.log(`   ${check.message}`));
  
  const failedChecks = checks.filter(c => !c.pass);
  
  if (failedChecks.length > 0) {
    console.log(`\n❌ ${failedChecks.length} check(s) failed. Please fix these issues before releasing.`);
    
    // Check if it's just store version mismatch
    const storeVersionIssues = failedChecks.filter(c => c.message.includes('version mismatch') || c.message.includes('Could not find version'));
    if (storeVersionIssues.length > 0 && storeVersionIssues.length === failedChecks.length) {
      console.log('\n💡 Tip: Store version mismatches will be automatically fixed during release');
    }
    
    displayChecklist();
    process.exit(1);
  } else {
    console.log('\n✅ All automated checks passed!');
    displayChecklist();
    console.log('\n🎯 Next step: Run `npm run release` when ready\n');
  }
}

main();