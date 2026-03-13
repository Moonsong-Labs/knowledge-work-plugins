# Plan Location Discovery

Before writing a design doc or plan, discover where the project stores documentation:

1. Check project instruction files (`CLAUDE.md`, `AGENTS.md`, or similar) for guidance on where to store design or implementation plans. If instructions exist, follow them — including checking whether an existing document should be updated instead of creating a new one.
2. Check for existing doc directories: `docs/`, `documentation/`, `doc/`
3. If found, explore the structure — look for subdirectories like `plans/`, `ADRs/`, `architecture/`, numbered folders (`01-overview/`, `02-architecture/`), or any existing plan/design files
4. Place the file in whichever existing directory is the closest match. Do not create new subdirectories within an existing doc structure — use what's already there.
5. Check existing files in the chosen directory for naming patterns:
   - Numbered prefix: `adr-001-structure.md`, `003-caching.md`
   - Date prefix: `2026-03-13-auth-system.md`
   - Plain names: `auth-system.md`, `caching-layer.md`
6. Follow the existing naming pattern. If the directory is empty or no pattern is clear, default to `YYYY-MM-DD-<topic>.md`
7. If no doc structure exists at all, default to `docs/plans/`
8. Announce your chosen path and wait for confirmation:
   > "I'll save this to `<chosen-path>/<filename>`. OK?"
9. If the user provides a different location, use that instead

Do NOT write files before confirming the location with the user.
