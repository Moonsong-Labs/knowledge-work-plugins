# Moonsong Labs Plugins

A collection of plugins for AI coding agents, built on top of composable "skills" and instructions that make sure your agent uses them.

## Plugins

### [Plugin Management](./plugin-management)

Create, customize, and manage plugins for AI coding assistants. Guides you through scaffolding plugin directories, designing components, and adapting distributable plugins for your organization.

### [Moonsong Engineering](./moonsong-engineering)

A complete software engineering workflow: brainstorming, planning, TDD, debugging, code review, and more. Built on composable skills that trigger automatically when your agent encounters relevant tasks.

### [Moonbeam Engineering](./moonbeam-engineering)

A collection of skills that enhance AI agents with specialized capabilities for developing on the Moonbeam parachain: adding pallets, precompiles, XCM messaging, runtime development, testing, migrations, and more.

## Installation

**Note:** Installation differs by platform. Claude Code and Cursor have built-in plugin marketplaces. Codex and OpenCode require manual setup.

### Claude Code (via Plugin Marketplace)

In Claude Code, register the marketplace first:

```bash
/plugin marketplace add Moonsong-Labs/knowledge-work-plugins
```

Then install the plugin from this marketplace:

```bash
/plugin install moonsong-engineering@moonsong-labs
```

### Cursor

Cursor automatically detects plugins installed by Claude Code. Install via Claude Code first, then restart Cursor.

### Codex

Tell Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/moonsong-engineering/.codex/INSTALL.md
```

**Detailed docs:** [moonsong-engineering/docs/README.codex.md](moonsong-engineering/docs/README.codex.md)

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/moonsong-engineering/.opencode/INSTALL.md
```

**Detailed docs:** [moonsong-engineering/docs/README.opencode.md](moonsong-engineering/docs/README.opencode.md)

### Verify Installation

Start a new session in your chosen platform and ask for something that should trigger a skill (for example, "help me plan this feature" or "let's debug this issue"). The agent should automatically invoke the relevant skill.

## Philosophy

- **Test-Driven Development** - Write tests first, always
- **Systematic over ad-hoc** - Process over guessing
- **Complexity reduction** - Simplicity as primary goal
- **Evidence over claims** - Verify before declaring success

## Contributing

### Adding a skill to an existing plugin

1. Fork the repository
2. Create a branch for your skill
3. Follow the `writing-skills` skill for creating and testing new skills
4. Submit a PR

See `moonsong-engineering/skills/writing-skills/SKILL.md` for the complete guide.

### Creating a new plugin

Plugins are self-contained directories at the root of this repository. The `plugin-management` plugin provides a guided workflow for creating new plugins.

1. Install the plugin-management plugin:

   ```bash
   /plugin install plugin-management@moonsong-labs
   ```

2. Ask your agent to create a new plugin:

   ```text
   I want to create a new plugin for [describe what it does]
   ```

   The `create-plugin` skill will activate and walk you through a 5-phase process: discovery, component planning, designing your first component, generating all files, and validation.

3. Submit a PR with your new plugin.

## Updating

Skills update automatically when you update the plugin:

```bash
/plugin update moonsong-engineering
```

## Acknowledgments

Inspired by:

- [Anthropic knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
- [Superpowers](https://github.com/obra/superpowers)
- [awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)