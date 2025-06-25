# Release Checklist for v[VERSION]

**Release Date:** [DATE]  
**Release Manager:** [NAME]

## Pre-Release Verification

### Code Quality
- [ ] All tests pass (when implemented)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No console errors in development mode
- [ ] Code follows project conventions

### Feature Testing
- [ ] All new features work as expected
- [ ] No regressions in existing features
- [ ] Keyboard shortcuts work correctly
- [ ] Settings persist correctly
- [ ] Search functionality works smoothly

### Cross-Browser Testing
- [ ] Chrome - Latest version
- [ ] Chrome - Previous version
- [ ] Firefox - Latest version
- [ ] Firefox - ESR version
- [ ] Edge (Chromium)
- [ ] Opera (if supported)

### UI/UX Review
- [ ] Dark mode works correctly
- [ ] Light mode works correctly
- [ ] All UI elements are properly aligned
- [ ] Icons display correctly at all sizes
- [ ] Responsive to different window sizes

### Documentation
- [ ] CHANGELOG.md updated with all changes
- [ ] README.md is up to date
- [ ] Version number updated in package.json
- [ ] Screenshots are current (if UI changed)

### Security
- [ ] No sensitive data in code
- [ ] Dependencies updated (`npm audit`)
- [ ] Permissions are minimal and justified

## Release Process

### Automated Release
- [ ] Run `npm run release:prepare`
- [ ] All checks pass
- [ ] Run appropriate release command
- [ ] GitHub release created successfully
- [ ] Release packages built correctly

### Store Submission
- [ ] Chrome Web Store
  - [ ] Package uploaded
  - [ ] Store listing updated
  - [ ] Submitted for review
- [ ] Firefox Add-ons
  - [ ] Package uploaded
  - [ ] Version notes added
  - [ ] Submitted for review

## Post-Release

### Verification
- [ ] GitHub release page accessible
- [ ] Download links work
- [ ] Tag is visible in repository

### Communication
- [ ] Update project website (if applicable)
- [ ] Announce on social media (if applicable)
- [ ] Notify active contributors

### Monitoring
- [ ] Monitor for user reports
- [ ] Check store reviews
- [ ] Watch for crash reports

## Notes

[Add any specific notes about this release]

---

**Sign-off:** _______________  
**Date:** _______________