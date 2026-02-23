# Installing Moonsong Engineering for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

## Installation Steps

### 1. Clone Moonsong Engineering

```bash
git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.config/opencode/moonsong-engineering
```

### 2. Register the Plugin

Create a symlink so OpenCode discovers the plugin:

```bash
mkdir -p ~/.config/opencode/plugins
rm -f ~/.config/opencode/plugins/moonsong-engineering.js
ln -s ~/.config/opencode/moonsong-engineering/moonsong-engineering/.opencode/plugins/moonsong-engineering.js ~/.config/opencode/plugins/moonsong-engineering.js
```

### 3. Symlink Skills

Create a symlink so OpenCode's native skill tool discovers skills:

```bash
mkdir -p ~/.config/opencode/skills
rm -rf ~/.config/opencode/skills/moonsong-engineering
ln -s ~/.config/opencode/moonsong-engineering/moonsong-engineering/skills ~/.config/opencode/skills/moonsong-engineering
```

### 4. Restart OpenCode

Restart OpenCode. The plugin will automatically inject skills context.

Verify by asking: "do you have skills?"

## Usage

### Finding Skills

Use OpenCode's native `skill` tool to list available skills:

```text
use skill tool to list skills
```

### Loading a Skill

Use OpenCode's native `skill` tool to load a specific skill:

```text
use skill tool to load moonsong-engineering/brainstorming
```

### Personal Skills

Create your own skills in `~/.config/opencode/skills/`:

```bash
mkdir -p ~/.config/opencode/skills/my-skill
```

Create `~/.config/opencode/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: Use when [condition] - [what it does]
---

# My Skill

[Your skill content here]
```

### Project Skills

Create project-specific skills in `.opencode/skills/` within your project.

**Skill Priority:** Project skills > Personal skills > Plugin skills

## Updating

```bash
cd ~/.config/opencode/moonsong-engineering
git pull
```

## Troubleshooting

### Plugin not loading

1. Check plugin symlink: `ls -l ~/.config/opencode/plugins/moonsong-engineering.js`
2. Check source exists: `ls ~/.config/opencode/moonsong-engineering/moonsong-engineering/.opencode/plugins/moonsong-engineering.js`
3. Check OpenCode logs for errors

### Skills not found

1. Check skills symlink: `ls -l ~/.config/opencode/skills/moonsong-engineering`
2. Verify it points to: `~/.config/opencode/moonsong-engineering/moonsong-engineering/skills`
3. Use `skill` tool to list what's discovered

### Tool mapping

When skills reference Claude Code tools:

- `TodoWrite` → `update_plan`
- `Task` with subagents → `@mention` syntax
- `Skill` tool → OpenCode's native `skill` tool
- File operations → your native tools

## Getting Help

- Report issues: https://github.com/Moonsong-Labs/knowledge-work-plugins/issues
- Full documentation: https://github.com/Moonsong-Labs/knowledge-work-plugins/blob/main/moonsong-engineering/docs/README.opencode.md
