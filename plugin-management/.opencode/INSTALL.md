# Installing the Plugin Management plugin for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

## Installation Steps

### 1. Clone the Plugin Management plugin

```bash
git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.config/opencode/plugin-management
```

### 2. Symlink Skills

```bash
mkdir -p ~/.config/opencode/skills
rm -rf ~/.config/opencode/skills/plugin-management
ln -s ~/.config/opencode/plugin-management/plugin-management/skills ~/.config/opencode/skills/plugin-management
```

### 3. Restart OpenCode

Restart OpenCode. Verify by asking: "do you have skills?"

## Updating

```bash
cd ~/.config/opencode/plugin-management
git pull
```

## Uninstalling

```bash
rm -rf ~/.config/opencode/skills/plugin-management
rm -rf ~/.config/opencode/plugin-management
```
