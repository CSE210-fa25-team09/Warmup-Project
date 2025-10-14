# Warmup-Project

Warmup project for CSE210 Fall 2025 - Team 09

## Getting Started

Welcome to the Warmup-Project! This repository follows a structured branching strategy and contribution guidelines to ensure code quality and smooth collaboration.

### Quick Links

- 📋 [Branching Strategy](BRANCHING_STRATEGY.md) - Learn about our branch structure and protection rules
- 🤝 [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to this project
- 🐛 [Report a Bug](https://github.com/CSE210-fa25-team09/Warmup-Project/issues/new?template=bug_report.md)
- ✨ [Request a Feature](https://github.com/CSE210-fa25-team09/Warmup-Project/issues/new?template=feature_request.md)

## Development Workflow

1. **Create a branch** following our naming convention:
   - `feature/<feature-name>` for new features
   - `bugfix/<bug-name>` for bug fixes
   - `<username>/<feature-name>` for personal feature branches

2. **Make your changes** and commit regularly using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve login issue"
   ```

3. **Create a Pull Request** using our PR template

4. **Get reviews** from team members

5. **Merge** after approval and passing all checks

## Branch Protection

Our `main` and `develop` branches are protected with the following rules:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
- ✅ Require conversation resolution
- ✅ No force pushes allowed
- ✅ No direct commits allowed

See [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) for complete details.

## Code Review Process

All pull requests require:

- At least **2 approvals** for merging to `main`
- At least **1 approval** for merging to `develop`
- All automated checks must pass
- All review conversations must be resolved

## Commit Message Guidelines

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, perf, test, chore, ci

**Example:**
```bash
feat(auth): add user login functionality

Implemented user authentication with JWT tokens.
Added login endpoint and token validation middleware.

Closes #123
```

## Resources

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## License

This project is part of CSE210 coursework.

## Team

CSE210 Fall 2025 - Team 09
