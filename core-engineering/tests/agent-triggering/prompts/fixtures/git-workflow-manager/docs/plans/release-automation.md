<!-- markdownlint-disable MD001 -->
# Release Automation Implementation Plan

> **For Claude:** REQUIRED: Use core-engineering:subagent-driven-development (if subagents available) or core-engineering:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up automated release workflow with semantic versioning

**Architecture:** Configure conventional commits, automated changelog generation, and git tag creation.

**Tech Stack:** Git, shell scripts

---

### Task 1: Design and implement release automation

Set up semantic-release with:
- Conventional commit enforcement via pre-commit hook
- Automated changelog generation from commit messages
- Git tag creation on merge to main
- Branch protection rules for main and release/*

**Files:**
- Create: `.github/workflows/release.yml`
- Create: `scripts/release.sh`
- Create: `.husky/commit-msg`

- [ ] **Step 1: Create commit-msg hook for conventional commit enforcement**

- [ ] **Step 2: Create release script with changelog generation**

- [ ] **Step 3: Create GitHub Actions release workflow**

- [ ] **Step 4: Commit**
