# Moonsong Labs Plugins

A collection of plugins for agentic AI assistants, built on top of composable "skills" and instructions that make sure your agent uses them.

## Plugins

### [Plugin Management](./plugin-management)

Create, customize, and manage plugins for agentic AI assistants. Guides you through scaffolding plugin directories, designing components, and adapting distributable plugins for your organization.

### [Core Engineering](./core-engineering)

A complete software engineering workflow: brainstorming, planning, TDD, debugging, code review, and more. Built on composable skills that trigger automatically when your agent encounters relevant tasks.

### [Fitness Reviewer](./fitness)

Review Codex skills and Claude subagents with structured findings, topology checks, and refactor guidance.

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
/plugin install core-engineering@moonsong-labs
```

### Cursor

Cursor automatically detects plugins installed by Claude Code. Install via Claude Code first, then restart Cursor.

### Codex

Tell Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/core-engineering/.codex/INSTALL.md
```

**Detailed docs:** [core-engineering/docs/README.codex.md](core-engineering/docs/README.codex.md)

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/core-engineering/.opencode/INSTALL.md
```

**Detailed docs:** [core-engineering/docs/README.opencode.md](core-engineering/docs/README.opencode.md)

### Verify Installation

Start a new session in your chosen platform and ask for something that should trigger a skill (for example, "help me plan this feature" or "let's debug this issue"). The agent should automatically invoke the relevant skill.

## Philosophy

- **Test-Driven Development** - Write tests first, always
- **Systematic over ad-hoc** - Process over guessing
- **Complexity reduction** - Simplicity as primary goal
- **Evidence over claims** - Verify before declaring success

## Contributing

### Adding a skill to an existing plugin

The `writing-skills` skill in the `plugin-management` plugin guides you through creating and testing new skills.

1. Fork and clone the repository
2. Start Claude Code with the plugin-management plugin loaded:

   ```bash
   claude --plugin-dir ./plugin-management
   ```

3. Ask your agent to create a new skill:

   ```text
   I want to add a new skill to [plugin name] for [describe what it does]
   ```

   The `writing-skills` skill will activate and guide you through the TDD process: write failing tests (baseline behavior), write the skill, verify it works, and refactor.

4. Submit a PR with your new skill.

### Creating a new plugin

Plugins are self-contained directories at the root of this repository. The `plugin-management` plugin provides a guided workflow for creating new plugins.

1. Fork and clone the repository
2. Start Claude Code with the plugin-management plugin loaded:

   ```bash
   claude --plugin-dir ./plugin-management
   ```

3. Ask your agent to create a new plugin:

   ```text
   I want to create a new plugin for [describe what it does]
   ```

   The `create-plugin` skill will activate and walk you through a 5-phase process: discovery, component planning, designing your first component, generating all files, and validation.

4. Submit a PR with your new plugin.

## Updating

Skills update automatically when you update the plugin:

```bash
/plugin update core-engineering
```

## Acknowledgments

Inspired by:

- [Anthropic knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
- [Superpowers](https://github.com/obra/superpowers)
- [awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
