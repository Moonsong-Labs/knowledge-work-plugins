# Skills for OpenCode

Complete guide for using the Core Engineering plugin with [OpenCode.ai](https://opencode.ai).

## Quick Install

Tell OpenCode:

```
Clone https://github.com/Moonsong-Labs/knowledge-work-plugins to ~/.config/opencode/knowledge-work-plugins, then symlink ~/.config/opencode/knowledge-work-plugins/core-engineering/skills to ~/.config/opencode/skills/core-engineering, then restart opencode.
```

## Manual Installation

### Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

### Steps

```bash
# 1. Clone the repository (or update existing)
if [ -d ~/.config/opencode/knowledge-work-plugins ]; then
  cd ~/.config/opencode/knowledge-work-plugins && git pull
else
  git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.config/opencode/knowledge-work-plugins
fi

# 2. Create skills directory
mkdir -p ~/.config/opencode/skills

# 3. Remove old symlink if it exists
rm -rf ~/.config/opencode/skills/core-engineering

# 4. Create symlink
ln -s ~/.config/opencode/knowledge-work-plugins/core-engineering/skills ~/.config/opencode/skills/core-engineering

# 5. Restart OpenCode
```

#### Verify Installation

```bash
ls -l ~/.config/opencode/skills/core-engineering
```

Should show a symlink pointing to the skills directory.

## Usage

### Finding Skills

Use OpenCode's native `skill` tool to list all available skills:

```
use skill tool to list skills
```

### Loading a Skill

Use OpenCode's native `skill` tool to load a specific skill:

```
use skill tool to load core-engineering/brainstorming
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

## Skill Locations

OpenCode discovers skills from these locations (in priority order):

1. **Project skills** (`.opencode/skills/`) - Highest priority
2. **Personal skills** (`~/.config/opencode/skills/`)
3. **Plugin skills** (`~/.config/opencode/skills/core-engineering/`) - via symlink

## Tool Mapping

Skills written for Claude Code are adapted for OpenCode:

- `TodoWrite` → `update_plan`
- `Task` with subagents → OpenCode's `@mention` system
- `Skill` tool → OpenCode's native `skill` tool
- File operations → Native OpenCode tools

## Updating

```bash
cd ~/.config/opencode/knowledge-work-plugins && git pull
```

Restart OpenCode to load the updates.

## Troubleshooting

### Skills not found

1. Verify skills symlink: `ls -l ~/.config/opencode/skills/core-engineering`
2. Use OpenCode's `skill` tool to list available skills
3. Check skill structure: each skill needs a `SKILL.md` file with valid frontmatter

## Uninstalling

```bash
rm ~/.config/opencode/skills/core-engineering
```

Optionally delete the clone: `rm -rf ~/.config/opencode/knowledge-work-plugins`

## Getting Help

- Report issues: https://github.com/Moonsong-Labs/knowledge-work-plugins/issues
- Main documentation: https://github.com/Moonsong-Labs/knowledge-work-plugins
- OpenCode docs: https://opencode.ai/docs/
