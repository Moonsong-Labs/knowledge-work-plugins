# Subagent Patterns

Use subagents only when they reduce complexity.

## When to use them

- The artifact is large enough that structure and rewrite planning would interfere with each other
- The task spans both Codex-skill and Claude-subagent review
- A rewrite draft needs to be produced after findings are agreed

## Recommended subagents

### Structure Reviewer

Use for:
- trigger precision
- unique knowledge density
- progressive disclosure
- dead bundles

Prompt shape:
`Review this artifact for structure and knowledge density only. Do not assess tools or host-specific conventions. Return findings with exact evidence, failed tests, and direct refactoring advice.`

### Codex Skill Reviewer

Use for:
- Codex-specific frontmatter and progressive disclosure checks
- reference and `agents/openai.yaml` coherence
- body discipline relative to the `description` trigger contract

Prompt shape:
`Review this Codex skill against the artifact-fitness baseline. Focus on trigger quality, reusable knowledge, progressive disclosure, and metadata alignment. Return only findings that materially affect reusability.`

### Claude Subagent Reviewer

Use for:
- focused-purpose checks
- least-privilege tool review
- prompt structure, examples, and constraint review

Prompt shape:
`Review this Claude subagent for focused scope, minimum necessary tools, clear execution instructions, and example or constraint quality. Return only findings that change adoption readiness.`

### Rewrite Drafter

Use for:
- replacement frontmatter
- tighter section structure
- concrete examples or fallback branches to add
- targeted rewrite snippets after findings are accepted

Prompt shape:
`Given these accepted findings, draft the smallest rewrite that fixes them. Preserve the artifact's intent, map each edit to a failed test, and prefer snippets over commentary.`

## Constraints

- Keep subagents narrow
- Do not create a fixed pipeline of subagents for every invocation
- Do not create a subagent only to restate the rubric
