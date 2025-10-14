# Branching Strategy

This document outlines the branching and push ruleset for the Warmup-Project repository.

## Branch Structure

### Main Branches

- **`main`**: The production-ready branch. This branch should always be stable and deployable.
  - Protected branch with strict rules
  - Only accepts changes via Pull Requests
  - Requires code review approval before merging
  - All tests must pass before merging

- **`develop`**: The integration branch for features. This is where features come together before release.
  - Protected branch with moderate rules
  - Accepts changes via Pull Requests
  - Requires at least one approval

### Supporting Branches

#### Feature Branches
- **Naming convention**: `feature/<feature-name>` or `<username>/feature-name`
- **Purpose**: Develop new features
- **Created from**: `develop` or `main`
- **Merged into**: `develop` or `main` via Pull Request
- **Example**: `feature/user-authentication` or `john/user-authentication`

#### Bugfix Branches
- **Naming convention**: `bugfix/<bug-name>` or `<username>/bugfix-name`
- **Purpose**: Fix non-critical bugs
- **Created from**: `develop` or `main`
- **Merged into**: `develop` or `main` via Pull Request
- **Example**: `bugfix/login-error` or `jane/login-error`

#### Hotfix Branches
- **Naming convention**: `hotfix/<hotfix-name>`
- **Purpose**: Emergency fixes for production
- **Created from**: `main`
- **Merged into**: `main` AND `develop` via Pull Request
- **Example**: `hotfix/critical-security-fix`

#### Release Branches
- **Naming convention**: `release/<version>`
- **Purpose**: Prepare for a production release
- **Created from**: `develop`
- **Merged into**: `main` AND `develop` via Pull Request
- **Example**: `release/v1.0.0`

## Branch Protection Rules

### For `main` Branch

1. **Require pull request reviews before merging**
   - Required approving reviews: 2
   - Dismiss stale pull request approvals when new commits are pushed
   - Require review from Code Owners

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging
   - All CI/CD checks must pass

3. **Require conversation resolution before merging**
   - All review comments must be resolved

4. **Require signed commits** (recommended)
   - Helps verify commit authenticity

5. **Include administrators**
   - Apply rules to repository administrators

6. **Restrict who can push to matching branches**
   - Only maintainers can push directly (emergency only)

7. **Do not allow force pushes**
   - Preserves commit history

8. **Do not allow deletions**
   - Prevents accidental branch deletion

### For `develop` Branch

1. **Require pull request reviews before merging**
   - Required approving reviews: 1
   - Dismiss stale pull request approvals when new commits are pushed

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging

3. **Require conversation resolution before merging**

4. **Do not allow force pushes**

5. **Do not allow deletions**

## Commit Message Guidelines

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools
- `ci`: Changes to CI configuration files and scripts

### Example:
```
feat(auth): add user login functionality

Implemented user authentication with JWT tokens.
Added login endpoint and token validation middleware.

Closes #123
```

## Pull Request Workflow

1. **Create a feature branch** from `develop` or `main`
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** and commit regularly
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Keep your branch up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Push your branch**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create a Pull Request** on GitHub
   - Fill out the PR template
   - Link related issues
   - Request reviews from team members

6. **Address review feedback**
   - Make changes based on feedback
   - Push new commits to the same branch
   - Respond to comments

7. **Merge when approved**
   - Ensure all checks pass
   - Ensure all conversations are resolved
   - Use "Squash and merge" for feature branches
   - Use "Create a merge commit" for release branches

## Best Practices

1. **Always work on a branch** - Never commit directly to `main` or `develop`

2. **Keep branches small and focused** - Easier to review and less likely to cause conflicts

3. **Write clear commit messages** - Follow the conventional commits specification

4. **Rebase before pushing** - Keep commit history clean
   ```bash
   git fetch origin
   git rebase origin/main
   ```

5. **Delete branches after merging** - Keep the repository clean

6. **Review your own PR first** - Check the diff before requesting reviews

7. **Test locally before pushing** - Don't rely solely on CI/CD

8. **Resolve conflicts promptly** - Don't let branches get stale

## Emergency Procedures

### Hotfix Process
1. Create hotfix branch from `main`
2. Fix the issue
3. Create PR to `main` with expedited review
4. After merging to `main`, create PR to merge to `develop`

### Rolling Back
If a problematic change reaches `main`:
1. Create a revert commit (don't use `git reset`)
2. Follow normal PR process for the revert
3. Fix the issue in a new branch
4. Re-apply the fix with proper testing

## References

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
