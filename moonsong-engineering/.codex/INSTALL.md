# Installing Skills for Codex

Enable skills in Codex via native skill discovery. Just clone and symlink.

## Prerequisites

- Git

## Installation

1. **Clone the skills repository:**

   ```bash
   git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.codex/moonsong-engineering
   ```

2. **Create the skills symlink:**

   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/moonsong-engineering/moonsong-engineering/skills ~/.agents/skills/moonsong-engineering
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/moonsong-engineering
```

You should see a symlink pointing to your skills directory.

## Updating

```bash
cd ~/.codex/moonsong-engineering && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/moonsong-engineering
```

Optionally delete the clone: `rm -rf ~/.codex/moonsong-engineering`.
