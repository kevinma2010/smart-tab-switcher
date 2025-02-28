# Contributing to Smart Tab Switcher

First off, thank you for considering contributing to Smart Tab Switcher! It's people like you that make Smart Tab Switcher such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior through GitHub Issues.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps to reproduce the problem
* Describe the behavior you observed and what behavior you expected
* Include browser version and extension version
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A detailed description of the proposed functionality
* Explain why this enhancement would be useful
* List any similar features in other extensions if you know of any

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows the existing style
6. Create the pull request!

### Development Process

1. **Setup your environment**
   ```bash
   git clone https://github.com/kevinma2010/smart-tab-switcher.git
   cd smart-tab-switcher
   pnpm install
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write your code
   - Add tests if necessary
   - Update documentation

4. **Test your changes**
   ```bash
   pnpm test
   pnpm lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add some feature"
   ```
   Please follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a pull request**
   - Fill in the pull request template
   - Link any relevant issues
   - Request review from maintainers

### Release Process

1. **Update version and changelog**
   - Update version in `package.json`
   - Add your changes to `CHANGELOG.md` under a new version section

2. **Build release packages**
   ```bash
   npm run build:release
   ```
   This will create:
   - `smart-tab-switcher-chrome-v{version}.zip`
   - `smart-tab-switcher-firefox-v{version}.zip`
   in the `release` directory.

3. **Create GitHub Release**
   - Create a new release on GitHub
   - Tag version as `v{version}`
   - Upload the zip files
   - Include the changelog in release notes

4. **Submit to Browser Stores**
   - Submit to Chrome Web Store
   - Submit to Firefox Add-ons

### Style Guidelines

#### JavaScript/TypeScript

- Use TypeScript for new code
- Follow the existing code style
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Follow the [Airbnb Style Guide](https://github.com/airbnb/javascript)

#### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Types of commits:
  - feat: A new feature
  - fix: A bug fix
  - docs: Documentation changes
  - style: Code style changes (formatting, missing semi colons, etc)
  - refactor: Code changes that neither fixes a bug nor adds a feature
  - perf: Code changes that improve performance
  - test: Adding missing tests
  - chore: Changes to the build process or auxiliary tools

### Documentation

- Keep READMEs updated
- Document new features
- Update CHANGELOG.md
- Comment your code
- Update TypeScript types

## Questions?

Feel free to open an issue on our [GitHub Issues](https://github.com/kevinma2010/smart-tab-switcher/issues) page.