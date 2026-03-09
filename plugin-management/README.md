# Plugin Management

Create, customize, and manage plugins for AI coding assistants. Works with Claude Code, Cursor, CodeX, and OpenCode.

## Skills

### create-plugin

Guides you through building a new plugin from scratch via a conversational 5-phase workflow:

1. **Discovery** - understand what you're building
2. **Component Planning** - determine skills, agents, commands, hooks
3. **Design First Component** - detailed design of the first component
4. **Implementation** - generate all plugin files
5. **Validation** - verify structure and report issues

### writing-skills

Guides you through creating new skills following a TDD process: write failing tests (baseline behavior without the skill), write the skill, verify agents comply, and refactor to close loopholes.

### plugin-customizer

Adapts distributable plugins for your organization by replacing `~~placeholder` patterns with your specific tool names (e.g., `~~project tracker` → Linear).

## Installation

**Note:** Installation differs by platform. Claude Code and Cursor have built-in plugin marketplaces. Codex and OpenCode require manual setup.

### Claude Code (via Plugin Marketplace)

In Claude Code, register the marketplace first:

```bash
/plugin marketplace add Moonsong-Labs/knowledge-work-plugins
```

Then install the plugin:

```bash
/plugin install plugin-management@moonsong-labs
```

### Cursor

Cursor automatically detects plugins installed by Claude Code. Install via Claude Code first, then restart Cursor.

### Codex

Tell Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/plugin-management/.codex/INSTALL.md
```

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/plugin-management/.opencode/INSTALL.md
```
