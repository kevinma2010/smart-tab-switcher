# Release Process

This document describes the release process for Smart Tab Switcher.

## Prerequisites

Before creating a release, ensure you have:

1. **Git** installed and configured
2. **GitHub CLI (`gh`)** installed and authenticated
   - Install: https://cli.github.com/
   - Authenticate: `gh auth login`
3. **pnpm** installed for building packages
4. Push access to the repository

## Release Workflow

### 1. Prepare for Release

First, ensure all your changes are committed and pushed to the main branch.

Update the CHANGELOG.md file:
- Add all changes under the `[Unreleased]` section
- Categorize changes using:
  - `Added` for new features
  - `Changed` for changes in existing functionality
  - `Fixed` for bug fixes
  - `Security` for security updates
  - `Removed` for removed features
  - `Deprecated` for soon-to-be removed features

Run the pre-release check:

```bash
npm run release:prepare
```

This will verify:
- You're on the main branch
- Working directory is clean
- Up to date with origin
- CHANGELOG has unreleased content
- Build process works

### 2. Create Release

Choose the appropriate release command based on the type of changes:

```bash
# For bug fixes (1.2.3 → 1.2.4)
npm run release:patch

# For new features (1.2.3 → 1.3.0)
npm run release:minor

# For breaking changes (1.2.3 → 2.0.0)
npm run release:major

# For custom version
npm run release
# Then select option 4 and enter version
```

The release script will:
1. Prompt for version type
2. Update version in package.json
3. Update CHANGELOG.md with release date
4. Commit the changes
5. Create an annotated git tag
6. Build release packages
7. Create GitHub release with zip files
8. Ask if you want to push changes

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **Major** (X.0.0): Breaking changes, major redesigns
- **Minor** (1.X.0): New features, enhancements
- **Patch** (1.2.X): Bug fixes, security updates

## Manual Release Process

If you need to create a release manually:

1. Update version in `package.json`
2. Update `CHANGELOG.md`:
   ```markdown
   ## [1.3.0] - 2025-06-25
   ### Added
   - New feature description
   ```
3. Commit changes:
   ```bash
   git add package.json CHANGELOG.md
   git commit -m "chore: release v1.3.0"
   ```
4. Create tag:
   ```bash
   git tag -a v1.3.0 -m "Release v1.3.0"
   ```
5. Build packages:
   ```bash
   npm run build:release
   ```
6. Push changes:
   ```bash
   git push origin main
   git push origin v1.3.0
   ```
7. Create GitHub release:
   ```bash
   gh release create v1.3.0 \
     --title "v1.3.0" \
     --notes "Release notes here" \
     release/smart-tab-switcher-chrome-v1.3.0.zip \
     release/smart-tab-switcher-firefox-v1.3.0.zip
   ```

## Troubleshooting

### Release script fails

1. Check all prerequisites are installed
2. Ensure you have uncommitted changes
3. Run `npm run release:prepare` to diagnose issues

### GitHub release creation fails

1. Ensure `gh` is authenticated: `gh auth status`
2. Check you have push access to the repository
3. Verify the tag doesn't already exist

### Build fails

1. Run `npm install` or `pnpm install`
2. Check TypeScript errors: `npm run type-check`
3. Clear build cache: `npm run clean`

## Release Checklist Template

Before releasing, ensure:

- [ ] All PRs for this release are merged
- [ ] CHANGELOG.md is updated with all changes
- [ ] Extension tested in Chrome
- [ ] Extension tested in Firefox
- [ ] No console errors in development
- [ ] Documentation is up to date
- [ ] Screenshots are current (if UI changed)
- [ ] Version follows semantic versioning
- [ ] Previous version is stable in production