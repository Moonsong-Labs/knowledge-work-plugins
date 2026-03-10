# Installing the Fitness Assessor plugin for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

## Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.config/opencode/knowledge-work-plugins
```

### 2. Symlink Skills

Create a symlink so OpenCode discovers the skills:

```bash
mkdir -p ~/.config/opencode/skills
ln -s ~/.config/opencode/knowledge-work-plugins/fitness/skills ~/.config/opencode/skills/fitness
```

### 3. Restart OpenCode

Restart OpenCode and verify by asking: "do you have skills?"

## Usage

Use OpenCode's native `skill` tool to list and load skills:

```text
use skill tool to list skills
use skill tool to load fitness/assessing-artifact-fitness
```

## Updating

```bash
cd ~/.config/opencode/knowledge-work-plugins && git pull
```

## Uninstalling

```bash
rm ~/.config/opencode/skills/fitness
```

Optionally delete the clone: `rm -rf ~/.config/opencode/knowledge-work-plugins`

## Getting Help

- Report issues: https://github.com/Moonsong-Labs/knowledge-work-plugins/issues
