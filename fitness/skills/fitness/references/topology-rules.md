# Topology Rules

Use this file when reviewing the shape of a skill bundle or subagent bundle before deeper file review.

## Primary File

- For skills, the primary file is `SKILL.md`.
- For standalone Claude subagents, the primary file is the agent file.
- For Codex skills, `agents/openai.yaml` is load-bearing metadata even if it is not linked from `SKILL.md`.

## Direct Discoverability

A load-bearing support file should be directly discoverable from the primary file.

Directly discoverable:
- linked from `SKILL.md`
- linked from the standalone subagent file
- required runtime metadata such as `agents/openai.yaml`

Not directly discoverable:
- only linked from another support file
- present in the bundle but never named by the primary artifact

## Too Deep

Flag `depth` when a load-bearing file is only reachable through another support file.

Examples:
- `SKILL.md` links to `references/index.md`, and only that file links to the real required reference
- a core example is only discoverable from another example file

If the missing direct link hides required behavior, use `P1`. Otherwise use `P2`.

## Fragmentation

Flag `fragmentation` when the artifact spreads one workflow across too many small support files without adding clarity.

Common signals:
- several tiny references that each contain one rule
- examples split so narrowly that the reader must hop between files to understand one concept
- support files that duplicate each other with slight wording changes

## Bundle Findings

Use `bundle` for:
- broken relative links
- stale paths after file renames
- orphaned load-bearing files
- support files that do not materially improve execution

## Topology Reviewer Output

The topology reviewer still uses the same reviewer JSON contract:
- `file` should be the primary file path
- `role` should be `topology`
- findings should focus on structure, not local prose quality
