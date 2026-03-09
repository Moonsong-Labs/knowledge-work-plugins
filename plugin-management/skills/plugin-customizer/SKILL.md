---
name: plugin-customizer
description: Use when installing or configuring a distributable plugin that contains ~~placeholder references needing replacement with organization-specific tool names
---

# Plugin Customizer

## Overview

Detect and resolve `~~placeholder` patterns in distributable plugins, replacing them with the user's organization-specific tool names.

## When to Use

- Installing a plugin with `~~` placeholders
- Adapting a shared plugin for your team's tools
- NOT for: creating plugins (use `create-plugin` instead)

## Checklist

You MUST create a task for each step and complete them in order:

1. **Detect** - find all `~~` patterns in the plugin
2. **Present** - show placeholders and their locations
3. **Resolve** - walk through each placeholder with the user
4. **Replace** - substitute all occurrences
5. **Validate** - confirm no `~~` patterns remain

## Process

### Step 1: Detection

Scan the plugin directory for `~~` patterns:

```bash
grep -rn '~~' <plugin-dir> --include='*.md' --include='*.json' | grep -v 'node_modules' | grep -v '.git'
```

Parse results into unique placeholders with their file locations.

Also check for CONNECTORS.md at the plugin root - it provides descriptions for each placeholder.

### Step 2: Presentation

Show the user what needs configuring:

```
This plugin has N placeholders to configure:

| Placeholder | Description | Used in |
|------------|-------------|---------|
| ~~project tracker | Where tasks and tickets live | skills/triage/SKILL.md, commands/check.md |
| ~~chat tool | Team messaging platform | skills/notify/SKILL.md |
```

### Step 3: Resolution

Walk through each placeholder one at a time:

**Ask:** "What's your **[category]**? ([common options], or something else?)"

Use the typical replacements from `references/placeholder-syntax.md` as suggestions.

Capture each answer before moving to the next placeholder.

### Step 4: Replacement

For each placeholder, replace ALL occurrences across ALL files:

```
Replacing ~~project tracker → Linear
  - skills/triage/SKILL.md (3 occurrences)
  - commands/check.md (1 occurrence)
```

Also update CONNECTORS.md to record the resolved values (or remove it if all placeholders are resolved).

### Step 5: Validation

Verify no `~~` patterns remain:

```bash
grep -rn '~~' <plugin-dir> --include='*.md' --include='*.json' | grep -v 'node_modules' | grep -v '.git'
```

Report results:

```
Customization complete:
[PASS] All 3 placeholders resolved
[PASS] No remaining ~~ patterns found
[INFO] CONNECTORS.md updated with resolved values
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Replacing in binary files | Only process .md and .json files |
| Missing nested references | Always grep recursively |
| Partial replacement | Use replace-all, verify with grep after |
