# Installing Skills for Codex

Enable skills in Codex via native skill discovery. Just clone and symlink.

## Prerequisites

- Git

## Installation

1. **Clone the skills repository:**

   ```bash
   git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.codex/plugin-management
   ```

2. **Create the skills symlink:**

   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/plugin-management/plugin-management/skills ~/.agents/skills/plugin-management
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/plugin-management
```

You should see a symlink pointing to your skills directory.

## Updating

```bash
cd ~/.codex/plugin-management && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/plugin-management
```

Optionally delete the clone: `rm -rf ~/.codex/plugin-management`.
