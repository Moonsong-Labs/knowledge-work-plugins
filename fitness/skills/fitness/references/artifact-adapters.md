# Artifact Adapters

Use the correct baseline for the artifact type and file role before generating findings.

## Primary Skill File

Apply this baseline when reviewing a `SKILL.md` file.

- Frontmatter should contain only `name` and `description`.
- `description` is the trigger contract. It should start with `Use when...` and describe triggering conditions rather than summarizing the workflow.
- The body should stay imperative and lean. Keep only the core workflow in `SKILL.md`.
- Move bulky detail into one-level-deep `references/`, `examples/`, or scripts only when those files materially improve execution.
- `agents/openai.yaml` should match the actual behavior and trigger scope.

Look for:
- a concrete reusable workflow, not generic prompt-writing advice
- a narrow trigger boundary with obvious near-misses that should not trigger
- output expectations, fallback behavior, and direct file-loading guidance

## Reference File

Apply this baseline when reviewing `references/*.md`.

- The file should deepen one specific area rather than restating the whole skill.
- The file should be directly discoverable from the primary artifact.
- The content should improve execution, not act as a second primary workflow.
- The file should not require another support file to explain its own role.

Look for:
- concise scope
- scan-friendly structure
- no hidden required behavior
- no duplication of the primary file

## Example File

Apply this baseline when reviewing `examples/*`.

- The example should model real desired behavior, not generic filler.
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

- Display name and short description should match the current job.
- Default prompt should describe the findings workflow, not the removed scorecard.
- Metadata must not promise unsupported artifact types or outputs.

Look for:
- runtime alignment
- stale terminology
- missing mention of structured findings or fix planning

## Claude Subagent

Apply this baseline when reviewing a standalone Claude subagent.

- The subagent should have a specific purpose and expertise area.
- The instructions should be detailed enough to execute without guessing the core workflow.
- Tool access should be the minimum necessary for the job.
- Use examples, constraints, or explicit structure when the task is fragile or easy to misexecute.
- Output shape, escalation points, and failure handling should be explicit.

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
