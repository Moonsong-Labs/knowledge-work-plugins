# Installing Skills for Codex

Enable skills in Codex via native skill discovery. Just clone and symlink.

## Prerequisites

- Git

## Installation

1. **Clone the skills repository:**

   ```bash
   git clone https://github.com/Moonsong-Labs/knowledge-work-plugins.git ~/.codex/moonbeam-engineering
   ```

2. **Create the skills symlink:**

   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/moonbeam-engineering/moonbeam-engineering/skills ~/.agents/skills/moonbeam-engineering
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

## Verify

```bash
ls -la ~/.agents/skills/moonbeam-engineering
```

You should see a symlink pointing to your skills directory.

## Updating

```bash
cd ~/.codex/moonbeam-engineering && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/moonbeam-engineering
```

Optionally delete the clone: `rm -rf ~/.codex/moonbeam-engineering`.
