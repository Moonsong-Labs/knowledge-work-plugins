# Fitness Reviewer

Review Codex skills and Claude subagents with structured findings, topology checks, and compact refactor plans.

## Skills

### [fitness](./skills/fitness/SKILL.md)

Audit a skill bundle or Claude subagent by combining topology review, file review, and package-level synthesis.

## Agents

### [artifact-fitness](./agents/artifact-fitness.md)

A companion agent for Claude and Cursor that applies the same structured-findings workflow with minimum necessary file-reading tools.

## Installation

**Note:** Installation differs by platform. Claude Code and Cursor have built-in plugin marketplaces. Codex and OpenCode require manual setup.

### Claude Code (via Plugin Marketplace)

In Claude Code, register the marketplace first:

```bash
/plugin marketplace add Moonsong-Labs/knowledge-work-plugins
```

Then install the plugin:

```bash
/plugin install fitness@moonsong-labs
```

### Cursor

Cursor automatically detects plugins installed by Claude Code. Install via Claude Code first, then restart Cursor.

### Codex

Tell Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/fitness/.codex/INSTALL.md
```

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/fitness/.opencode/INSTALL.md
```
