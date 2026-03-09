# Skills for Codex

Guide for using Skills with OpenAI Codex via native skill discovery.

## Quick Install

Tell Codex:

```
Fetch and follow instructions from https://raw.githubusercontent.com/Moonsong-Labs/knowledge-work-plugins/refs/heads/main/core-engineering/.codex/INSTALL.md
```

## Manual Installation

### Prerequisites

- OpenAI Codex CLI
- Git

### Steps

1. Clone the repo:

   ```bash
   git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.codex/core-engineering
   ```

2. Create the skills symlink:

   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/core-engineering/core-engineering/skills ~/.agents/skills/core-engineering
   ```

3. Restart Codex.

## How It Works

Codex has native skill discovery — it scans `~/.agents/skills/` at startup, parses SKILL.md frontmatter, and loads skills on demand. Skills are made visible through a single symlink:

```text
~/.agents/skills/core-engineering/ → ~/.codex/core-engineering/core-engineering/skills/
```

The `using-skills` skill is discovered automatically and enforces skill usage discipline — no additional configuration needed.

## Usage

Skills are discovered automatically. Codex activates them when:

- You mention a skill by name (e.g., "use brainstorming")
- The task matches a skill's description
- The `using-skills` skill directs Codex to use one

### Personal Skills

Create your own skills in `~/.agents/skills/`:

```bash
mkdir -p ~/.agents/skills/my-skill
```

Create `~/.agents/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: Use when [condition] - [what it does]
---

# My Skill

[Your skill content here]
```

The `description` field is how Codex decides when to activate a skill automatically — write it as a clear trigger condition.

## Updating

```bash
cd ~/.codex/core-engineering && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/core-engineering
```

Optionally delete the clone: `rm -rf ~/.codex/core-engineering`.

## Troubleshooting

### Skills not showing up

1. Verify the symlink: `ls -la ~/.agents/skills/core-engineering`
2. Check skills exist: `ls ~/.codex/core-engineering/core-engineering/skills`
3. Restart Codex — skills are discovered at startup

## Getting Help

- Report issues: https://github.com/Moonsong-Labs/knowledge-work-plugins/issues
- Main documentation: https://github.com/Moonsong-Labs/knowledge-work-plugins
