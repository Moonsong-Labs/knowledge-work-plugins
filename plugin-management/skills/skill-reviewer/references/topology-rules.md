# Topology Rules

Use `../../../references/skill-standards/README.md` as the baseline. This file narrows the topology pass to `DISCLOSURE-01`, `TOPOLOGY-01`, `TOPOLOGY-02`, and `METADATA-01`.

## Primary File

- For artifacts rooted at `SKILL.md`, the primary definition file is `SKILL.md`.
- For standalone agent definitions, the primary definition file is the agent file.
- Required runtime metadata such as `agents/openai.yaml` is load-bearing even if it is not linked from `SKILL.md`.
- Prefix titles with the relevant shared rule ID when the topology failure comes from the shared standard.

## Direct Discoverability

`TOPOLOGY-01` requires load-bearing support files to be directly discoverable from the primary file.

Directly discoverable:
- linked from `SKILL.md`
- linked from the standalone agent file
- required runtime metadata such as `agents/openai.yaml`

Not directly discoverable:
- only linked from another support file
- present in the bundle but never named by the primary artifact

## Too Deep

Flag `depth` when a load-bearing file is only reachable through another support file. This is usually a `[TOPOLOGY-01]` or `[TOPOLOGY-02]` failure.

Examples:
- `SKILL.md` links to `references/index.md`, and only that file links to the real required reference
- a core example is only discoverable from another example file

If the missing direct link hides required behavior, use `P1`. Otherwise use `P2`.

## Fragmentation

Flag `fragmentation` when the artifact spreads one workflow across too many small support files without adding clarity. This is usually a `[TOPOLOGY-02]` failure.

Common signals:
- several tiny references that each contain one rule
- examples split so narrowly that the reader must hop between files to understand one concept
- support files that duplicate each other with slight wording changes

## Bundle Findings

Use `bundle` for:
- broken relative links
- stale paths after file renames
- orphaned load-bearing files
- support files that do not materially improve execution (`DISCLOSURE-01`)

## Topology Reviewer Output

The topology reviewer still uses the same reviewer JSON contract:
- `file` should be the primary file path
- `role` should be `topology`
- findings should focus on structure, not local prose quality
