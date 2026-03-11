# Artifact Adapters

Use `../../../references/skill-standards/README.md` as the baseline. This file maps shared rule IDs to reviewer-local roles, kinds, and evidence expectations.

## Primary Definition File (`SKILL.md`)

Apply this baseline when reviewing a `SKILL.md` file.

- `NAME-01` and `FRONTMATTER-01` usually fail as `formatting`.
- `TRIGGER-01`, `TRIGGER-02`, and `SEARCH-01` usually fail as `trigger` or `coherence`.
- `STRUCTURE-01`, `STRUCTURE-02`, and `DISCLOSURE-01` usually fail as `pattern` or `coherence`.
- `TOPOLOGY-01` and `TOPOLOGY-02` only become local file findings when the problem is visible from the file under review. Otherwise leave them to topology.
- `METADATA-01` or `RUNTIME-01` mismatches can surface as `coherence` from the primary file when the description/body drift is visible there.

Look for:
- a concrete reusable workflow, not generic prompt-writing advice
- a narrow trigger boundary with obvious near-misses that should not trigger
- output expectations, fallback behavior, and direct file-loading guidance
- titles prefixed with shared rule IDs when the violation comes from the shared standard

## Reference File

Apply this baseline when reviewing `references/*.md`.

- `DISCLOSURE-01` checks whether the file materially reduces primary-file load.
- `TOPOLOGY-01` and `TOPOLOGY-02` check whether the file is directly discoverable and not part of a multi-hop maze.
- Use `pattern`, `bundle`, `depth`, or `fragmentation` based on the smallest real problem.

Look for:
- concise scope
- scan-friendly structure
- no hidden required behavior
- no duplication of the primary file

## Example File

Apply this baseline when reviewing `examples/*`.

- `EXAMPLE-01` governs realism, currentness, and regression value.
- JSON examples should match the actual reviewer contract exactly.
- Markdown report examples should match the final synthesized output format.
- Examples should make regression obvious after future edits.

Look for:
- realistic artifact type and file role
- evidence-rich findings
- concrete fixes
- no legacy score-sheet language

## Metadata File

Apply this baseline when reviewing `agents/openai.yaml`.

- `METADATA-01` covers display name, short description, and prompt accuracy.
- `RUNTIME-01` covers parity with the companion host-specific definition when both exist.

Look for:
- runtime alignment
- stale terminology
- missing mention of structured findings, rule IDs, or fix planning

## Standalone Agent File

Apply this baseline when reviewing a standalone agent definition.

- `STRUCTURE-01` and `RUNTIME-01` cover the job, structure, and parity with the companion `SKILL.md`-rooted definition when both exist.
- Tool access remains reviewer-local and should still use the `tool_scope` finding kind.

Look for:
- narrow scope rather than "general assistant" behavior
- tool choices justified by the task
- concrete steps, boundaries, and deliverable format

## Package-Level Checks

Only the synthesizer should make these judgments:
- whether the artifact deserves to exist as a reusable capability
- whether the bundle hangs together as one coherent artifact
- whether the `description` and the actual behavior match
- whether the bundle is too deep or too fragmented overall

## Knowledge-Heavy Benchmark

Research-heavy or analysis-heavy artifacts should usually include:
- a clear trigger boundary for when current information matters
- an ordered workflow with setup, execution, and reporting steps
- explicit output contract
- source or evidence expectations
- fallback behavior when freshness, auth, or tooling is unavailable

Treat the strongest research-oriented skills in this marketplace as the calibration bar: they define source policy, fallback behavior, and output expectations explicitly rather than relying on generic prompting advice.

If a knowledge-heavy artifact is missing two or more of those elements, emit findings under `pattern`, `trigger`, or `examples` rather than inventing a numeric penalty.
