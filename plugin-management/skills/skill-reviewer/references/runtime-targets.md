# Runtime Targets

Use this file as the single source of truth for runtime-specific packaging.

## Route Ownership

- Codex and OpenCode runtime definition:
  - `skills/skill-reviewer/SKILL.md`
  - `skills/skill-reviewer/agents/openai.yaml`
- Claude Code and Cursor runtime definition:
  - `agents/artifact-reviewer.md`

Use `../../../references/skill-standards/README.md` as the shared baseline for both runtimes.

Do not assume one runtime reads the other's metadata file.

## Alignment Rules

- Keep the same core job across both runtimes:
  - audit Codex skills, skill bundles, and Claude subagents as reusable artifacts
  - collect topology and file findings before package-level judgment
  - use the same status ladder: `good`, `needs_improvement`, `rethink`
  - use the same reviewer JSON contract
  - return the same final user-facing sections
- Allow runtime-specific differences only where the host requires them:
  - Codex uses `agents/openai.yaml` for UI metadata
  - Claude uses agent frontmatter and tool declarations
  - Interaction wording may differ to match host UX
  - Parallel reviewers may be real subagents or inline reviewers depending on host capability

## Drift Checks

When either runtime artifact changes, verify:
- trigger scope still matches across Codex and Claude
- supported artifact types still match
- status definitions still match
- reviewer JSON shape still matches
- final output sections still match
- targeted-question policy still matches
- raw reviewer JSON remains internal by default
- Claude tool scope remains minimum necessary

If one runtime adds behavior that the other cannot support, record that difference explicitly rather than leaving the two definitions to diverge silently.
