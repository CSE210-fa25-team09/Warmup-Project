# GitHub Branch Protection Setup Guide

This guide provides step-by-step instructions for configuring branch protection rules in the GitHub web interface.

## Prerequisites

- Repository admin access
- GitHub organization or repository with appropriate permissions

## Setting Up Branch Protection for `main`

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar
4. Under "Branch protection rules", click **Add rule** or **Add branch protection rule**

### Step 2: Configure `main` Branch Protection

#### Branch name pattern
```
main
```

#### Protect matching branches

Enable the following options:

##### 1. Require a pull request before merging
- ✅ **Check this box**
- **Required approvals:** `2`
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require review from Code Owners** (if CODEOWNERS file exists)
- ✅ **Restrict who can dismiss pull request reviews** (optional)
- ✅ **Require approval of the most recent reviewable push**

##### 2. Require status checks to pass before merging
- ✅ **Check this box**
- ✅ **Require branches to be up to date before merging**
- Add required status checks:
  - `pr-validation` (from pr-checks.yml workflow)
  - `commit-validation` (from pr-checks.yml workflow)
  - Add any other CI/CD checks as they are added

##### 3. Require conversation resolution before merging
- ✅ **Check this box**

##### 4. Require signed commits (recommended)
- ✅ **Check this box** (if you want to enforce commit signing)

##### 5. Require linear history (optional)
- ☐ **Optional:** Enforce all commits to be added to base via rebase or squash merge

##### 6. Require deployments to succeed before merging (optional)
- ☐ **Optional:** If you have deployment environments set up

##### 7. Lock branch
- ☐ **Do not check:** Allow read-only access (only for archiving)

##### 8. Do not allow bypassing the above settings
- ✅ **Check this box** to include administrators
- This ensures even admins follow the rules

##### 9. Restrict who can push to matching branches
- ✅ **Check this box**
- Add only maintainers/emergency contacts
- This prevents direct pushes, forcing use of PRs

##### 10. Allow force pushes
- ☐ **Do not check:** Prevent force pushes to preserve history

##### 11. Allow deletions
- ☐ **Do not check:** Prevent accidental branch deletion

### Step 3: Save the Rule

Click **Create** or **Save changes** at the bottom of the page.

---

## Setting Up Branch Protection for `develop`

Follow the same steps as above, but use these modified settings:

#### Branch name pattern
```
develop
```

#### Modified Settings for `develop`

1. **Required approvals:** `1` (instead of 2)
2. All other settings remain the same as `main`

---

## Setting Up Rulesets (GitHub's New Feature)

GitHub now supports Rulesets, which provide more flexibility than traditional branch protection rules.

### Navigate to Rulesets

1. Go to **Settings** → **Rules** → **Rulesets**
2. Click **New ruleset** → **New branch ruleset**

### Configure Ruleset for Protected Branches

#### 1. Ruleset Name
```
Protected Branches (main/develop)
```

#### 2. Enforcement status
- **Active**

#### 3. Target branches

Add branch targeting:
- **Include by pattern:** `main`
- **Include by pattern:** `develop`

#### 4. Rules

Enable these rules:

##### Branch Protections
- ✅ **Restrict creations**
- ✅ **Restrict updates**
- ✅ **Restrict deletions**
- ✅ **Require linear history** (optional)
- ✅ **Require deployments to succeed** (if applicable)
- ✅ **Require signed commits** (recommended)

##### Pull Request Requirements
- ✅ **Require a pull request before merging**
  - Required approvals: `2` for main, `1` for develop
  - Dismiss stale reviews: **Yes**
  - Require review from code owners: **Yes**
  - Require approval of most recent push: **Yes**

##### Status Check Requirements
- ✅ **Require status checks to pass**
  - Require branches to be up to date: **Yes**
  - Status checks:
    - `pr-validation`
    - `commit-validation`
    - `auto-label`

##### Additional Settings
- ✅ **Block force pushes**
- ✅ **Require conversation resolution before merging**

#### 5. Bypass list

Add users/teams that can bypass these rules (use sparingly):
- Repository administrators (for emergencies only)
- You can leave this empty to enforce for everyone

#### 6. Save Ruleset

Click **Create** to save the ruleset.

---

## Verification

After setting up branch protection:

1. **Test with a PR:**
   - Create a test branch
   - Make a small change
   - Open a PR to `main`
   - Verify that:
     - Direct push is blocked
     - PR requires reviews
     - Status checks are required
     - Conversations must be resolved

2. **Check Settings:**
   - Navigate to **Settings** → **Branches**
   - Verify the rules show a lock icon next to `main` and `develop`

3. **Review Access:**
   - Ensure only appropriate team members have admin access
   - Review who can approve PRs

---

## Troubleshooting

### Issue: Status checks not appearing

**Solution:**
- The workflow must run at least once before it appears in the list
- Create a test PR to trigger the workflow
- Then add it to required status checks

### Issue: Unable to merge despite approvals

**Possible causes:**
- Status checks not passing
- Branch not up to date with base
- Conversations not resolved
- Required reviewers not approved

### Issue: Admins bypass rules accidentally

**Solution:**
- Enable "Do not allow bypassing the above settings"
- Use rulesets instead of branch protection (rulesets have better bypass control)

---

## Updating Protection Rules

To update existing rules:

1. Go to **Settings** → **Branches**
2. Find the rule for the branch
3. Click **Edit**
4. Make your changes
5. Click **Save changes**

---

## Best Practices

1. **Start with strict rules:** It's easier to relax rules than to tighten them later

2. **Document exceptions:** If you need to bypass rules, document why in the PR

3. **Review regularly:** Periodically review and update protection rules as the project evolves

4. **Communicate changes:** Let the team know when protection rules change

5. **Use rulesets for complex scenarios:** Rulesets provide more flexibility than traditional branch protection

6. **Test in a test repository first:** If unsure, test your configuration in a test repo

---

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

---

## Summary Checklist

Use this checklist to ensure all protection is set up:

- [ ] Branch protection rule created for `main`
  - [ ] Requires 2 approvals
  - [ ] Requires status checks
  - [ ] Requires conversation resolution
  - [ ] No force pushes
  - [ ] No deletions
  - [ ] No direct pushes

- [ ] Branch protection rule created for `develop`
  - [ ] Requires 1 approval
  - [ ] Requires status checks
  - [ ] Requires conversation resolution
  - [ ] No force pushes
  - [ ] No deletions
  - [ ] No direct pushes

- [ ] Status checks configured
  - [ ] `pr-validation` added
  - [ ] `commit-validation` added
  - [ ] Other CI/CD checks added as needed

- [ ] CODEOWNERS file reviewed and code owner reviews enabled

- [ ] Team notified about new branch protection rules

- [ ] Documentation reviewed and updated

- [ ] Tested with a sample PR
