# Project Management

Skills for project management tasks: risk assessment with dual scoring, architecture decision records following the MADR standard, and mitigation planning.

## What's Inside

| Component | Type | Description |
|-----------|------|-------------|
| [risk-management](./skills/risk-management/SKILL.md) | Skill | Structured risk assessment with 5x5 matrix, inherent/residual scoring, and mitigation plans |
| [architecture-decision-record](./skills/architecture-decision-record/SKILL.md) | Skill | Create ADRs following the MADR (Markdown Any Decision Records) standard |

## Installation

**Note:** Installation differs by platform. Claude Code and Cursor have built-in plugin marketplaces. Codex and OpenCode require manual setup.

### Claude Code (via Plugin Marketplace)

In Claude Code, register the marketplace first:

```bash
/plugin marketplace add Moonsong-Labs/knowledge-work-plugins
```

Then install the plugin:

```bash
/plugin install project-management@moonsong-labs
```

### Cursor

Cursor automatically detects plugins installed by Claude Code. Install via Claude Code first, then restart Cursor.

### Codex

Tell Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/project-management/.codex/INSTALL.md
```

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/project-management/.opencode/INSTALL.md
```
