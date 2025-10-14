# Quick Start Guide

A quick reference guide for working with this repository.

## 🚀 First Time Setup

```bash
# Clone the repository
git clone https://github.com/CSE210-fa25-team09/Warmup-Project.git
cd Warmup-Project

# Check your git configuration
git config user.name
git config user.email
```

## 📝 Daily Workflow

### 1. Start Working on a New Feature

```bash
# Update your local repository
git checkout main
git pull origin main

# Create a new branch
git checkout -b feature/my-awesome-feature
# or for personal branches: git checkout -b yourname/my-feature
```

### 2. Make Changes

```bash
# Make your code changes
# ... edit files ...

# Check what changed
git status
git diff

# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat: add awesome new feature"
```

### 3. Push Your Changes

```bash
# Push your branch to GitHub
git push origin feature/my-awesome-feature
```

### 4. Create a Pull Request

1. Go to GitHub: https://github.com/CSE210-fa25-team09/Warmup-Project
2. Click "Compare & pull request"
3. Fill out the PR template
4. Request reviewers
5. Click "Create pull request"

### 5. Address Review Feedback

```bash
# Make requested changes
# ... edit files ...

# Commit and push
git add .
git commit -m "fix: address review feedback"
git push origin feature/my-awesome-feature
```

### 6. After PR is Merged

```bash
# Switch back to main and update
git checkout main
git pull origin main

# Delete your local branch
git branch -d feature/my-awesome-feature

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/my-awesome-feature
```

## 📋 Branch Naming

✅ **Correct:**
- `feature/user-login`
- `bugfix/fix-crash`
- `hotfix/security-patch`
- `john/add-dashboard`

❌ **Incorrect:**
- `my-branch`
- `test`
- `fix`
- `new-stuff`

## 💬 Commit Messages

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

### Examples

✅ **Good:**
```bash
git commit -m "feat: add user registration"
git commit -m "fix: resolve login timeout issue"
git commit -m "docs: update API documentation"
```

❌ **Bad:**
```bash
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## 🔍 Common Commands

### Check Repository Status
```bash
git status                    # See what changed
git log --oneline -10         # See recent commits
git branch                    # List branches
```

### Update Your Branch
```bash
# If main has updates while you're working
git fetch origin
git rebase origin/main
# or
git merge origin/main
```

### Fix Common Issues

#### Accidentally committed to wrong branch
```bash
git reset HEAD~1              # Undo last commit, keep changes
git stash                     # Save changes temporarily
git checkout -b feature/new-branch
git stash pop                 # Apply saved changes
```

#### Need to undo last commit
```bash
git reset --soft HEAD~1       # Undo commit, keep changes staged
# or
git reset --hard HEAD~1       # Undo commit, discard changes (⚠️ dangerous)
```

#### Branch got behind main
```bash
git fetch origin
git rebase origin/main        # Replay your changes on top of main
```

## 🎯 Before Creating a PR

- [ ] Branch name follows convention
- [ ] All commits have good messages
- [ ] Code is tested locally
- [ ] No unnecessary files included
- [ ] Branch is up to date with main

## ⚡ Cheat Sheet

| Task | Command |
|------|---------|
| Create branch | `git checkout -b feature/name` |
| See changes | `git status` & `git diff` |
| Stage all | `git add .` |
| Commit | `git commit -m "feat: description"` |
| Push | `git push origin branch-name` |
| Update from main | `git pull origin main` |
| Switch branch | `git checkout branch-name` |
| Delete branch | `git branch -d branch-name` |

## 📚 Learn More

- [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) - Detailed branching guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Full contribution guidelines
- [SETUP_SUMMARY.md](SETUP_SUMMARY.md) - What's implemented

## 🆘 Need Help?

1. Check the documentation files
2. Ask in the team chat
3. Create an issue with questions
4. Check [GitHub Git Guides](https://github.com/git-guides)

## 💡 Tips

- **Commit often** - Small commits are better than large ones
- **Pull regularly** - Stay up to date with main
- **Write clear messages** - Future you will thank you
- **Test before pushing** - Catch bugs early
- **Ask for help** - Don't struggle alone

---

**Happy Coding! 🎉**
