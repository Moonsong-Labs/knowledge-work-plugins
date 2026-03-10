# Fitness Assessor

Assess Codex skills and Claude subagents for reusable artifact fitness: trigger precision, knowledge density, workflow clarity, tool scope, and remediation readiness.

## Skills

### [assessing-artifact-fitness](./skills/assessing-artifact-fitness/SKILL.md)

Review a Codex skill or Claude subagent and decide whether it deserves to exist as a reusable capability.

## Agents

### [artifact-fitness](./agents/artifact-fitness.md)

A companion agent for Claude and Cursor that applies the same artifact-fitness review workflow with minimum necessary file-reading tools.

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
