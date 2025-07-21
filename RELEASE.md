# Release Process

## Prerequisites

1. **Git** and **GitHub CLI (`gh`)** installed and authenticated
2. **pnpm** for building packages
3. Push access to the repository

## Release Workflow

### 1. Prepare for Release

Ensure all changes are committed and pushed to main branch.

Update CHANGELOG.md:
- Add all changes under `[Unreleased]` section
- Use categories: `Added`, `Changed`, `Fixed`, `Security`, `Removed`, `Deprecated`

Run pre-release check:
```bash
npm run release:prepare
```

This verifies: branch status, working directory, CHANGELOG content, and build process.

### 2. Create Release

Choose the appropriate command:

```bash
npm run release:patch   # Bug fixes
npm run release:minor   # New features
npm run release:major   # Breaking changes
npm run release         # Custom version
```

The script automatically: updates version, modifies CHANGELOG, commits changes, creates tag, builds packages, and creates GitHub release.

## Version Numbering

Follows [Semantic Versioning](https://semver.org/):
- **Major** (X.0.0): Breaking changes
- **Minor** (1.X.0): New features
- **Patch** (1.2.X): Bug fixes

## Manual Release Process

1. Update `package.json` and `CHANGELOG.md`
2. Commit: `git commit -m "chore: release vX.X.X"`
3. Tag: `git tag -a vX.X.X -m "Release vX.X.X"`
4. Build: `npm run build:release`
5. Push: `git push origin main --tags`
6. Create GitHub release with `gh` CLI and upload zip files

## Troubleshooting

- **Script fails**: Check prerequisites, run `npm run release:prepare`
- **GitHub fails**: Verify `gh auth status` and repository access
- **Build fails**: Run `pnpm install` and `npm run type-check`

## Release Checklist

- [ ] All PRs merged
- [ ] CHANGELOG.md updated
- [ ] Tested in Chrome and Firefox
- [ ] No console errors
- [ ] Documentation current
- [ ] Version follows semver