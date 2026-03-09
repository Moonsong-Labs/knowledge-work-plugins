# Component Schemas

Reference for all plugin component types and their required formats.

## Plugin Manifests

### Claude Code (.claude-plugin/plugin.json)

Required fields:
- `name`: kebab-case plugin name

Optional fields:
- `description`: What the plugin does
- `version`: semver (start at `0.1.0`)
- `author`: `{ "name": "Author Name" }`
- `homepage`: URL
- `repository`: URL
- `license`: SPDX identifier
- `keywords`: array of strings

```json
{
  "name": "my-plugin",
  "description": "What this plugin does",
  "version": "0.1.0",
  "author": { "name": "Author Name" },
  "homepage": "https://github.com/org/repo",
  "repository": "https://github.com/org/repo",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"]
}
```

### Cursor (.cursor-plugin/plugin.json)

Same as Claude Code plus path fields:

```json
{
  "name": "my-plugin",
  "displayName": "My Plugin",
  "description": "What this plugin does",
  "version": "0.1.0",
  "author": { "name": "Author Name" },
  "skills": "./skills/",
  "agents": "./agents/",
  "commands": "./commands/",
  "hooks": "./hooks/hooks.json"
}
```

Only include path fields for component types the plugin actually has. Omit or use empty string for unused types.

### CodeX (.codex/INSTALL.md)

Clone-and-symlink pattern:

```markdown
# Installing Skills for Codex

## Installation

1. Clone: `git clone <repo-url> ~/.codex/<plugin-name>`
2. Symlink: `ln -s ~/.codex/<plugin-name>/<plugin-name>/skills ~/.agents/skills/<plugin-name>`
3. Restart Codex
```

### OpenCode (.opencode/INSTALL.md)

Clone-and-symlink pattern (same as CodeX, different paths):

```markdown
# Installing the <Plugin Name> plugin for OpenCode

## Installation

1. Clone: `git clone <repo-url> ~/.config/opencode/knowledge-work-plugins`
2. Symlink: `ln -s ~/.config/opencode/knowledge-work-plugins/<plugin-name>/skills ~/.config/opencode/skills/<plugin-name>`
3. Restart OpenCode
```

---

## Skills (skills/&lt;name&gt;/SKILL.md)

### Frontmatter (YAML)

- `name`: letters, numbers, hyphens only. No parentheses or special characters.
- `description`: Max 1024 chars total. Start with "Use when...". Third person. Describe ONLY triggering conditions, never summarize the workflow.

```yaml
---
name: my-skill-name
description: Use when [specific triggering conditions and symptoms]
---
```

### Body Structure

```markdown
# Skill Name

## Overview
Core principle in 1-2 sentences.

## When to Use
Bullet list with symptoms and use cases.
When NOT to use.

## Core Pattern
Before/after comparison or scanning table.

## Quick Reference
Table or bullets for common operations.

## Implementation
Inline code or link to separate file.

## Common Mistakes
What goes wrong + fixes.
```

---

## Agents (agents/&lt;name&gt;.md)

### Frontmatter

```yaml
---
name: agent-name
description: |
  Use this agent when [condition]. Examples: <example>Context: ... user: "..." assistant: "..." <commentary>...</commentary></example>
model: inherit
---
```

### Body

Role description followed by numbered capability sections. Written in second person ("You will...").

---

## Commands (commands/&lt;name&gt;.md)

### Frontmatter

```yaml
---
description: "Brief description of what the command does"
disable-model-invocation: true
---
```

### Body

Instruction to invoke a skill or perform an action.

```markdown
Invoke the plugin-name:skill-name skill and follow it exactly as presented to you
```

---

## Hooks (hooks/hooks.json)

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "'${CLAUDE_PLUGIN_ROOT}/hooks/session-start'",
            "async": false
          }
        ]
      }
    ]
  }
}
```

Use `${CLAUDE_PLUGIN_ROOT}` for paths relative to the plugin root.

---

## Connectors (CONNECTORS.md)

For distributable plugins that use `~~placeholder` syntax:

```markdown
# Connectors

| Placeholder | Category | Description |
|------------|----------|-------------|
| ~~project tracker | Project Management | Where tasks and tickets live |
```

Rules:
- Placeholder format: `~~category name` (lowercase, spaces allowed)
- Use in any markdown file: "Check ~~project tracker for the ticket"
- Each placeholder MUST have an entry in CONNECTORS.md
