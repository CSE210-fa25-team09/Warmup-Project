# Contributing to Warmup-Project

Thank you for your interest in contributing to Warmup-Project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Review Process](#review-process)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help create a welcoming environment for all contributors

## Getting Started

### Prerequisites

1. Git installed on your machine
2. A GitHub account
3. Access to the repository

### Setting Up Your Development Environment

1. **Fork the repository** (if you're an external contributor)

2. **Clone the repository**
   ```bash
   git clone https://github.com/CSE210-fa25-team09/Warmup-Project.git
   cd Warmup-Project
   ```

3. **Set up remotes**
   ```bash
   git remote add upstream https://github.com/CSE210-fa25-team09/Warmup-Project.git
   ```

4. **Keep your fork synchronized**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

## Development Workflow

1. **Check the issue tracker** - Look for existing issues or create a new one
2. **Get assigned** - Comment on the issue to get it assigned to you
3. **Create a branch** - Use the naming convention from our branching strategy
4. **Make changes** - Implement your feature or fix
5. **Test thoroughly** - Ensure your changes work as expected
6. **Commit your changes** - Follow our commit message guidelines
7. **Push to your branch** - Push your changes to GitHub
8. **Create a Pull Request** - Submit your changes for review

## Branching Strategy

We follow a structured branching strategy. Please read [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) for detailed information.

### Quick Reference

- **Feature branches**: `feature/<feature-name>` or `<username>/<feature-name>`
- **Bug fixes**: `bugfix/<bug-name>` or `<username>/<bugfix-name>`
- **Hotfixes**: `hotfix/<hotfix-name>`
- **Releases**: `release/<version>`

### Creating a Branch

```bash
# For a new feature
git checkout -b feature/my-new-feature

# For a bug fix
git checkout -b bugfix/fix-login-issue

# For personal feature branch
git checkout -b john/user-profile
```

## Pull Request Process

### Before Creating a PR

1. **Ensure your branch is up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all tests** - Make sure everything passes

3. **Review your own changes** - Check the diff for any unintended changes

4. **Update documentation** - If you changed functionality

### Creating a PR

1. **Push your branch** to GitHub
   ```bash
   git push origin feature/my-new-feature
   ```

2. **Navigate to the repository** on GitHub

3. **Click "New Pull Request"**

4. **Fill out the PR template** completely
   - Provide a clear title
   - Describe what changed and why
   - Link related issues
   - Add screenshots if UI changes were made
   - List any breaking changes

5. **Request reviewers** - Tag appropriate team members

6. **Add labels** - Help categorize your PR

### During Review

1. **Respond to feedback promptly**

2. **Make requested changes** - Push new commits to the same branch

3. **Resolve conversations** - Mark comments as resolved when addressed

4. **Keep the PR updated** - Rebase if conflicts arise

5. **Be patient and professional** - Reviews take time

### After Approval

1. **Ensure all checks pass** - CI/CD must be green

2. **Ensure all conversations are resolved**

3. **Squash commits if needed** - Keep history clean

4. **Merge the PR** - Use appropriate merge strategy

5. **Delete your branch** - Clean up after merging

## Coding Standards

### General Guidelines

- **Write clean, readable code** - Others will need to understand it
- **Follow existing patterns** - Maintain consistency
- **Comment complex logic** - Explain the "why", not the "what"
- **Keep functions small** - Single responsibility principle
- **Use meaningful names** - Variables and functions should be self-documenting

### Code Quality

- **No commented-out code** - Remove it or use version control
- **No console.log in production code** - Use proper logging
- **Handle errors properly** - Don't ignore exceptions
- **Write tests** - Cover your changes with tests
- **Avoid code duplication** - DRY principle

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic changes)
- **refactor**: Code restructuring (no functional changes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or tooling changes
- **ci**: CI/CD configuration changes

### Examples

```bash
# Simple feature
git commit -m "feat: add user registration endpoint"

# Bug fix with details
git commit -m "fix: resolve null pointer in user service

The user service was not checking for null values before
accessing user properties, causing crashes.

Fixes #456"

# Documentation update
git commit -m "docs: update API documentation for auth endpoints"

# Breaking change
git commit -m "feat!: change authentication to use OAuth2

BREAKING CHANGE: The authentication system now requires OAuth2.
Update your clients to use the new auth flow."
```

### Commit Best Practices

1. **Commit often** - Small, logical commits are better than large ones
2. **Write meaningful messages** - Future you will thank you
3. **One commit per logical change** - Easier to review and revert
4. **Keep commits atomic** - Each commit should be self-contained

## Review Process

### As a Reviewer

1. **Be timely** - Review within 24-48 hours if possible
2. **Be thorough** - Check functionality, tests, and documentation
3. **Be constructive** - Suggest improvements, don't just criticize
4. **Be specific** - Point to exact lines and explain your concerns
5. **Approve when ready** - Don't hold up good work

### Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and pass
- [ ] Documentation is updated
- [ ] No unnecessary changes included
- [ ] Commit messages follow guidelines
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
- [ ] Error handling is appropriate

### Review Comments

Use these labels in your review comments:

- **MUST**: Required change before approval
- **SHOULD**: Recommended change
- **NIT**: Minor suggestion (nitpick)
- **QUESTION**: Asking for clarification
- **PRAISE**: Acknowledging good work

Example:
```
MUST: Add error handling for null user.
This could cause a crash if the user doesn't exist.
```

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues and PRs
3. Ask in the issue you're working on
4. Contact the maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
