# Contributing to Upstream (SpeciesFileGroup/taxonpages)

This document explains how to manage this downstream fork of SpeciesFileGroup/taxonpages while maintaining Purdue-specific customizations and contributing improvements back upstream.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Branch Structure](#branch-structure)
- [File Categories](#file-categories)
- [Config File Management](#config-file-management)
- [Contributing to Upstream](#contributing-to-upstream)
- [Syncing from Upstream](#syncing-from-upstream)

---

## Architecture Overview

This repository is a **downstream fork** of the upstream TaxonPages project maintained by SpeciesFileGroup. We maintain Purdue-specific branding and deployment configurations while benefiting from upstream improvements.

**Git Remotes:**
- `sfg` - https://github.com/SpeciesFileGroup/taxonpages.git (upstream)
- `origin` - PurdueEntomologicalResearchCollection/taxonpages (GitHub Pages)
- `dev` - PurdueEntomologicalResearchCollection/taxonpages-dev (GitHub Pages dev)
- `deploy` - PurdueEntomologicalResearchCollection/taxonpages-deploy (Cascade CMS production)
- `deploy-dev` - PurdueEntomologicalResearchCollection/taxonpages-deploy-dev (Cascade CMS test)
- `purdue` - git@github.itap.purdue.edu:wbbaker/taxonpages.git

---

## Branch Structure

### Working Branches (Application Code)
These branches contain the Vue.js application code and have **config files gitignored**:

- `main` - Production deployment (GitHub Pages)
- `dev-main` - Development deployment (GitHub Pages dev)
- `deploy-main` - Production Cascade CMS deployment
- `deploy-dev-main` - Test Cascade CMS deployment

### Setup Branches (Configuration Only)
These branches contain configuration files that are gitignored in working branches:

- `setup` - Production configuration
- `dev-setup` - Development configuration
- `deploy-setup` - Production Cascade configuration
- `deploy-dev-setup` - Test Cascade configuration

**Important:** Config files live in setup branches and are checked out locally as needed.

---

## File Categories

### ✅ Safe to Contribute Upstream

These changes benefit the entire TaxonPages community:

#### Bug Fixes & Improvements
- Vue component logic fixes
- Incorrect class names or broken references
- Missing CSS variables (add with neutral defaults)
- Performance improvements

#### ADA/Accessibility Improvements
- Missing ARIA labels
- Empty table headers
- Improper heading structure
- Keyboard navigation issues
- Color contrast improvements (using CSS variables)

#### Generic Features
- New panels or components
- API service improvements
- Build tooling updates

#### CSS Architecture Improvements
- Replacing hardcoded colors with CSS variables
- Example: `hover:text-gray-900` → `hover:text-secondary-color`
- This allows upstream to benefit from better theming without adopting our brand

---

### ❌ Never Contribute Upstream

These are Purdue-specific and should stay in PERC branches:

#### Purdue Branding Files
- `src/assets/css/vars.css` - Contains Purdue brand colors (Aged Gold, etc.)
- `src/assets/css/purdue-united-sans.css` - Purdue font declarations
- `src/assets/css/purdue-styles-*.css` - Any Purdue-specific styling
- `config/style/purdue-cascade.css` - Cascade CMS overrides

#### Configuration Files (Gitignored in Working Branches)
- `config/api.yml` - API endpoints and tokens
- `config/router.yml` - Base URLs (different per deployment)
- `config/project.yml` - Project-specific metadata
- `config/taxa_page.yml` - Panel layout configuration
- `config/maps.yml` - Map configuration
- `config/metadata.yml` - SEO and meta tags
- `config/features.yml` - Feature flags

#### Deployment-Specific Code
- GitHub Actions workflows for Cascade deployments
- Purdue-specific base URLs or routing logic

---

### 🤔 Case-by-Case Evaluation

These might or might not be appropriate for upstream:

- **Link styling preferences** (underlines, hover effects) - Could make configurable
- **Footer customizations** - Depends if it's structural or just branding
- **Default theme colors** - Add neutral defaults upstream, override in Purdue branches
- **Feature flags** - If generally useful, contribute; if Purdue-specific, keep local

---

## Config File Management

Config files are **gitignored in working branches** but **managed in setup branches**.

### Viewing Current Config

```bash
# You're on dev-main, config files are present but gitignored
ls config/
# Shows files, but git doesn't track them
git status
# Won't show config files as modified
```

### Editing Config Files

**Step 1: Switch to Setup Branch**
```bash
# Save any uncommitted work first
git stash

# Switch to the corresponding setup branch
git checkout dev-setup
```

**Step 2: Make Changes**
```bash
# Edit config files
vim config/api.yml
vim config/router.yml
# etc.

# Commit changes to the setup branch
git add config/
git commit -m "Update API configuration"
git push origin dev-setup
```

**Step 3: Return to Working Branch**
```bash
# Switch back to working branch
git checkout dev-main

# Restore any stashed work
git stash pop

# Pull the updated config files locally
git checkout dev-setup -- config/
```

**Step 4: Test with New Config**
```bash
# Config files are now updated locally but won't show in git status
npm run dev
# Test your changes
```

### Config Changes Workflow Summary

| Action | Command |
|--------|---------|
| View configs | `ls config/` (works from any branch) |
| Edit configs | Switch to `*-setup` branch, edit, commit, push |
| Use updated configs | `git checkout <setup-branch> -- config/` |
| Deploy with configs | Configs are baked in during build process |

---

## Contributing to Upstream

### Step 1: Identify Upstream-Ready Changes

Ask yourself:
- ✅ Is this a bug fix, ADA improvement, or generic feature?
- ✅ Does it use CSS variables instead of hardcoded Purdue colors?
- ✅ Is it free of Purdue-specific branding?
- ❌ Does it involve config files or deployment-specific code?

### Step 2: Make Changes on Your Working Branch

```bash
# Work on your branch as normal
git checkout dev-main

# Make ADA/bug fixes
vim src/components/Autocomplete/Autocomplete.global.vue
git add .
git commit -m "Fix: Add accessible label to search input"

# Make another fix
vim src/modules/otus/components/TaxaInfo.vue
git commit -m "Fix: Remove empty h2 tag"
```

### Step 3: Create Clean Branch for Upstream

```bash
# Fetch latest from upstream
git fetch sfg

# Create a new branch from upstream main
git checkout -b fix/ada-improvements sfg/main

# Cherry-pick only the upstream-appropriate commits
git log dev-main --oneline | head -20  # Find commit hashes
git cherry-pick <commit-hash-1>
git cherry-pick <commit-hash-2>
# Skip any commits that touch Purdue-specific files
```

### Step 4: Review Changes

```bash
# Verify no Purdue-specific changes snuck in
git diff sfg/main

# Check for:
# - No references to Purdue colors (RGB values like 142, 111, 62)
# - No changes to purdue-*.css files
# - No config file changes
# - CSS variable usage instead of hardcoded colors
```

### Step 5: Push and Create PR

```bash
# Push to your fork on GitHub
git push sfg fix/ada-improvements

# Create PR on GitHub to SpeciesFileGroup/taxonpages
# Describe changes and why they benefit all TaxonPages users
```

### Step 6: After Upstream Merge

```bash
# Pull upstream changes back to your branches
git checkout dev-main
git fetch sfg
git merge sfg/main

# Purdue-specific files won't conflict (they're gitignored or separate)
# Your color overrides in vars.css will remain
```

---

## Syncing from Upstream

Regularly pull improvements from SpeciesFileGroup:

```bash
# From your working branch
git checkout dev-main

# Fetch and merge upstream changes
git fetch sfg
git merge sfg/main

# Resolve any conflicts (unlikely with proper separation)
git push origin dev-main

# Repeat for other branches as needed
```

### Handling Conflicts

If conflicts occur with Purdue-specific files:

```bash
# Keep your version for Purdue-specific files
git checkout --ours src/assets/css/vars.css

# Keep upstream version for everything else
git checkout --theirs src/components/SomeComponent.vue

# Complete the merge
git add .
git commit
```

---

## Examples

### Example 1: Adding an ADA Fix (Upstream-Ready)

```bash
# On dev-main
vim src/components/Autocomplete/Autocomplete.global.vue
# Add <label for="search-input" class="sr-only">Search</label>

git commit -m "Fix: Add accessible label to autocomplete input

Adds sr-only label to search input for screen reader accessibility.
Addresses WCAG 2.1 Level A requirement for form labels."

# Contribute to upstream
git checkout -b fix/autocomplete-label sfg/main
git cherry-pick <commit-hash>
git push sfg fix/autocomplete-label
# Create PR to SpeciesFileGroup/taxonpages
```

### Example 2: Updating Purdue Colors (Branch-Specific)

```bash
# Switch to setup branch to edit config
git checkout dev-setup

# Edit colors
vim config/style/theme.css  # Or wherever colors are defined

git commit -m "Update Purdue Aged Gold to new brand specification"
git push origin dev-setup

# Back to working branch
git checkout dev-main
git checkout dev-setup -- config/

# Test changes
npm run dev
```

### Example 3: Replacing Hardcoded Color with Variable (Upstream-Ready)

```bash
# On dev-main
vim src/modules/otus/components/Breadcrumb/Breadcrumb.vue

# Change:
# class="hover:text-gray-900"
# To:
# class="hover:text-secondary-color"

git commit -m "Refactor: Use CSS variable for breadcrumb hover color

Replaces hardcoded gray-900 with secondary-color CSS variable.
This improves theme consistency and customization without
changing default behavior."

# This is upstream-ready because it uses CSS variables
# Upstream will define secondary-color, we override it in our theme
git checkout -b refactor/breadcrumb-theme-colors sfg/main
git cherry-pick <commit-hash>
git push sfg refactor/breadcrumb-theme-colors
```

---

## Quick Reference

### Branch Naming Convention

| Purpose | Purdue Branch | Setup Branch |
|---------|---------------|--------------|
| Development | `dev-main` | `dev-setup` |
| Production GitHub Pages | `main` | `setup` |
| Cascade Production | `deploy-main` | `deploy-setup` |
| Cascade Test | `deploy-dev-main` | `deploy-dev-setup` |

### Common Git Commands

```bash
# View all remotes
git remote -v

# Fetch from upstream
git fetch sfg

# See what's new upstream
git log dev-main..sfg/main --oneline

# Cherry-pick a commit
git cherry-pick <commit-hash>

# Get config files from setup branch
git checkout dev-setup -- config/

# Create branch from upstream
git checkout -b my-feature sfg/main
```

---

## Questions?

If you're unsure whether a change should go upstream:
1. Does it use CSS variables for colors? ✅ Probably yes
2. Is it an accessibility improvement? ✅ Definitely yes
3. Does it mention Purdue specifically? ❌ Definitely no
4. Does it touch config files? ❌ No, those are branch-specific
5. Still unsure? Ask in the PR description or create a draft PR

Remember: When in doubt, contribute! The upstream maintainers can always request changes or decline if it's not appropriate. Most improvements that use proper CSS variables and avoid hardcoded branding will be welcomed.
