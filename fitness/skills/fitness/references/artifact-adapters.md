# Artifact Adapters

Use the correct baseline for the artifact type before scoring it.

## Codex Skill Baseline

Apply the marketplace skill baseline used throughout this repository.

- Frontmatter should contain only `name` and `description`.
- `description` is the trigger contract. It should start with `Use when...` and describe triggering conditions rather than summarizing the workflow.
- The body should stay imperative and lean. Keep only the core workflow in `SKILL.md`.
- Move bulky detail into one-level-deep `references/`, `scripts/`, or examples only when those files materially improve execution.
- `agents/openai.yaml` should match the actual behavior and trigger scope.

Look for:
- a concrete reusable workflow, not generic prompt-writing advice
- a narrow trigger boundary with obvious near-misses that should not trigger
- output expectations, fallback behavior, and file-loading guidance

## Claude Subagent Baseline

Apply Anthropic-style subagent expectations derived from:
- [Claude Code subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Multishot prompting](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting)
- [XML tags](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)

- The subagent should have a specific purpose and expertise area.
- The instructions should be detailed enough to execute without guessing the core workflow.
- Tool access should be the minimum necessary for the job.
- Use examples, constraints, or explicit structure when the task is fragile or easy to mis-execute.
- Output shape, escalation points, and failure handling should be explicit.

Look for:
- narrow scope rather than "general assistant" behavior
- tool choices justified by the task
- concrete steps, boundaries, and deliverable format

## Knowledge-Heavy Benchmark

Research-heavy or analysis-heavy artifacts should usually include:
- a clear trigger boundary for when current information matters
- an ordered workflow with setup, execution, and reporting steps
- explicit output contract
- source or evidence expectations
- fallback behavior when freshness, auth, or tooling is unavailable

Treat the strongest research-oriented skills in this marketplace as the calibration bar: they define output sections, source policy, and fallback behavior explicitly rather than relying on generic prompting advice.

If a knowledge-heavy artifact is missing two or more of those elements, lower `Executable Workflow Clarity`, `Freshness and Evidence Policy`, and `Examples and Testability`.
