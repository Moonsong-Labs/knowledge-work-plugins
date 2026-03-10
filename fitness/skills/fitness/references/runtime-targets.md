# Runtime Targets

Use this file as the single source of truth for runtime-specific packaging.

## Route Ownership

- Codex and OpenCode runtime definition:
  - `skills/assessing-artifact-fitness/SKILL.md`
  - `skills/assessing-artifact-fitness/agents/openai.yaml`
- Claude Code and Cursor runtime definition:
  - `agents/artifact-fitness.md`

Do not assume one runtime reads the other's metadata file.

## Alignment Rules

- Keep the same core job across both runtimes:
  - assess Codex skills and Claude subagents for reusable artifact fitness
  - run the existence test before scoring
  - use the same verdict ladder
  - require the same review sections
  - allow targeted user questions only when the answer materially changes the assessment or rewrite path
  - offer rewrite guidance only after findings are presented
- Allow runtime-specific differences only where the host requires them:
  - Codex uses `agents/openai.yaml` for UI metadata
  - Claude uses agent frontmatter and tool declarations
  - Interaction wording may differ to match host UX

## Drift Checks

When either runtime artifact changes, verify:
- trigger scope still matches across Codex and Claude
- supported artifact types still match
- verdict definitions still match
- required output sections still match
- targeted-question policy still matches
- rewrite guidance remains opt-in
- Claude tool scope remains minimum necessary

If one runtime adds behavior that the other cannot support, record that difference explicitly rather than leaving the two definitions to diverge silently.
