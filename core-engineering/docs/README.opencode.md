# Skills for OpenCode

Complete guide for using Skills with [OpenCode.ai](https://opencode.ai).

## Quick Install

Tell OpenCode:

```
Clone https://github.com/Moonsong-Labs/knowledge-work-plugins to ~/.config/opencode/core-engineering, then create directory ~/.config/opencode/plugins, then symlink ~/.config/opencode/core-engineering/core-engineering/.opencode/plugins/core-engineering.js to ~/.config/opencode/plugins/core-engineering.js, then symlink ~/.config/opencode/core-engineering/core-engineering/skills to ~/.config/opencode/skills/core-engineering, then restart opencode.
```

## Manual Installation

### Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

### Steps

```bash
# 1. Install Skills (or update existing)
if [ -d ~/.config/opencode/core-engineering ]; then
  cd ~/.config/opencode/core-engineering && git pull
else
  git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.config/opencode/core-engineering
fi

# 2. Create directories
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills

# 3. Remove old symlinks/directories if they exist
rm -f ~/.config/opencode/plugins/core-engineering.js
rm -rf ~/.config/opencode/skills/core-engineering

# 4. Create symlinks
ln -s ~/.config/opencode/core-engineering/core-engineering/.opencode/plugins/core-engineering.js ~/.config/opencode/plugins/core-engineering.js
ln -s ~/.config/opencode/core-engineering/core-engineering/skills ~/.config/opencode/skills/core-engineering

# 5. Restart OpenCode
```

#### Verify Installation

```bash
ls -l ~/.config/opencode/plugins/core-engineering.js
ls -l ~/.config/opencode/skills/core-engineering
```

Both should show symlinks pointing to the core-engineering directory.

## Usage

### Finding Skills

Use OpenCode's native `skill` tool to list all available skills:

```
use skill tool to list skills
```

### Loading a Skill

Use OpenCode's native `skill` tool to load a specific skill:

```
use skill tool to load skills/brainstorming
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

Create project-specific skills in your OpenCode project:

```bash
# In your OpenCode project
mkdir -p .opencode/skills/my-project-skill
```

Create `.opencode/skills/my-project-skill/SKILL.md`:

```markdown
---
name: my-project-skill
description: Use when [condition] - [what it does]
---

# My Project Skill

[Your skill content here]
```

## Skill Locations

OpenCode discovers skills from these locations:

1. **Project skills** (`.opencode/skills/`) - Highest priority
2. **Personal skills** (`~/.config/opencode/skills/`)
3. **Plugin skills** (`~/.config/opencode/skills/core-engineering/`) - via symlink

## Features

### Automatic Context Injection

The plugin automatically injects skills context via the `experimental.chat.system.transform` hook. This adds the "using-skills" skill content to the system prompt on every request.

### Native Skills Integration

Skills uses OpenCode's native `skill` tool for skill discovery and loading. Skills are symlinked into `~/.config/opencode/skills/core-engineering/` so they appear alongside your personal and project skills.

### Tool Mapping

Skills written for Claude Code are automatically adapted for OpenCode. The bootstrap provides mapping instructions:

- `TodoWrite` → `update_plan`
- `Task` with subagents → OpenCode's `@mention` system
- `Skill` tool → OpenCode's native `skill` tool
- File operations → Native OpenCode tools

## Architecture

### Plugin Structure

**Location:** `~/.config/opencode/core-engineering/core-engineering/.opencode/plugins/core-engineering.js`

**Components:**
- `experimental.chat.system.transform` hook for bootstrap injection
- Reads and injects the "using-skills" skill content

### Skills

**Location:** `~/.config/opencode/skills/core-engineering/` (symlink to `~/.config/opencode/core-engineering/core-engineering/skills/`)

Skills are discovered by OpenCode's native skill system. Each skill has a `SKILL.md` file with YAML frontmatter.

## Updating

```bash
cd ~/.config/opencode/core-engineering
git pull
```

Restart OpenCode to load the updates.

## Troubleshooting

### Plugin not loading

1. Check plugin exists: `ls ~/.config/opencode/core-engineering/core-engineering/.opencode/plugins/core-engineering.js`
2. Check symlink: `ls -l ~/.config/opencode/plugins/`
3. Check OpenCode logs: `opencode run "test" --print-logs --log-level DEBUG`
4. Look for plugin loading message in logs

### Skills not found

1. Verify skills symlink: `ls -l ~/.config/opencode/skills/core-engineering` (should point to core-engineering/core-engineering/skills/)
2. Use OpenCode's `skill` tool to list available skills
3. Check skill structure: each skill needs a `SKILL.md` file with valid frontmatter

### Bootstrap not appearing

1. Verify using-skills skill exists: `ls ~/.config/opencode/core-engineering/core-engineering/skills/using-skills/SKILL.md`
2. Check OpenCode version supports `experimental.chat.system.transform` hook
3. Restart OpenCode after plugin changes

## Getting Help

- Report issues: https://github.com/Moonsong-Labs/knowledge-work-plugins/issues
- Main documentation: https://github.com/Moonsong-Labs/knowledge-work-plugins
- OpenCode docs: https://opencode.ai/docs/

## Testing

Verify your installation:

```bash
# Check plugin loads
opencode run --print-logs "hello" 2>&1 | grep -i skills

# Check skills are discoverable
opencode run "use skill tool to list all skills" 2>&1 | grep -i skills

# Check bootstrap injection
opencode run "what skills do you have?"
```

The agent should mention having skills and be able to list skills from `skills/`.
