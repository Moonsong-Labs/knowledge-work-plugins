# Installing Skills for Codex

Enable skills in Codex via native skill discovery. Just clone and symlink.

## Prerequisites

- Git

## Installation

1. **Clone the skills repository:**

   ```bash
   git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.codex/project-management
   ```

2. **Create the skills symlink:**

   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/project-management/project-management/skills ~/.agents/skills/project-management
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/project-management
```

You should see a symlink pointing to your skills directory.

## Updating

```bash
cd ~/.codex/project-management && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/project-management
```

Optionally delete the clone: `rm -rf ~/.codex/project-management`.
