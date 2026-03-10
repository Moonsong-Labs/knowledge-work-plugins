---
name: fitness
description: Use when auditing or refactoring a Codex skill or Claude subagent to decide whether it is specific enough, evidence-aware enough, and operationally complete enough to keep as a reusable capability.
---

# Assessing Artifact Fitness

Assess reusable knowledge artifacts, not generic prompts.

## Supported Artifacts

- Codex skills rooted at `**/SKILL.md`
- Claude subagents with markdown or config instructions plus declared tools
- Directly referenced support files that materially change behavior, such as `references/`, `scripts/`, examples, or manifests

Do not use this skill for slash commands, generic runbooks, or one-off prompt review.

## Runtime Mapping

Use `references/runtime-targets.md` as the source of truth for which artifact defines behavior in Codex versus Claude.

## Core Standard

Judge whether the artifact deserves to exist as a reusable capability.

- Pass the existence test only when it contains non-obvious, reusable knowledge or operational structure.
- Penalize artifacts that mostly restate general advice, wrap a single obvious tool call, or promise more than they teach.
- For knowledge-heavy artifacts, compare specificity against strong exemplars: explicit trigger boundary, ordered workflow, output contract, setup or fallback behavior, and realistic failure handling.

## Assessment Workflow

Run this workflow in order for each artifact.

1. Identify the artifact type, then read the primary file and only the directly referenced support files needed to understand behavior.
2. Load these references:
   - `references/quality-rubric.md`
   - `references/anti-patterns.md`
   - `references/artifact-adapters.md`
   - `references/finding-to-advice.md`
   - `references/test-cases.md`
3. Run the existence test before scoring.
   - Cap the verdict at `RETHINK` if the artifact is structurally valid but does not justify existing as a reusable skill or subagent.
   - Use `REJECT` when it is mostly generic, actively misleading, or clearly shaped for the wrong abstraction.
4. Score the artifact on the eight rubric dimensions.
5. Turn every negative finding into a failed test plus a concrete remediation pattern.
6. Synthesize the final review using the required output sections, ask targeted questions only when the answer materially changes the assessment or rewrite path, then offer rewrite guidance after findings when there are actionable fixes.
7. If remediation is requested, produce the smallest rewrite that fixes the accepted issues. Prefer replacement snippets, section moves, example additions, and frontmatter rewrites over generic commentary.

## Review Helpers

Use narrow review helpers only when they reduce noise. See `references/subagent-patterns.md`.

## Required Output Sections

Each Markdown assessment must include these sections:
- `Verdict`
- `Artifact Type`
- `Existence Test`
- `Fitness Summary`
- `Scores`
- `Blocking Gaps`
- `What Already Works`
- `Advice by Failure Mode`
- `Suggested Test Prompts`
- `Rewrite Brief`

## Verdicts

Use one of:
- `ADOPT`
- `IMPROVE`
- `RETHINK`
- `REJECT`

- `ADOPT`: the artifact clearly justifies existing as a reusable capability and only needs minor tightening, if any.
- `IMPROVE`: the artifact is worthwhile but missing important specificity, structure, or fallback behavior.
- `RETHINK`: the artifact may contain salvageable pieces, but it currently lacks enough unique knowledge or has the wrong shape for the role.
- `REJECT`: the artifact is mostly generic, misleading, or counterproductive as a reusable skill or subagent.

## Interaction Policy

Default to completing the assessment without interruption.

Ask a user question during or after the review only when the answer would materially change:
- the verdict
- the failed-test or remediation mapping
- whether the artifact should be kept, narrowed, or collapsed
- the rewrite path

Otherwise, make a reasonable assumption, state it briefly, and continue.

Platform behavior:
- **Claude Code**: use AskUserQuestion behavior when available
- **Codex**: ask directly in normal response flow

Always present findings before offering rewrite guidance.
Ask whether rewrite guidance should run now when there are actionable fixes.
Do not ask preference questions that only affect tone, formatting, or minor wording.

If user confirms remediation:
- Produce targeted rewrite snippets, replacement sections, and concrete edits tied to each failed test
- Do not auto-apply file edits unless explicitly requested

## Evidence Policy

- Prefer local artifact evidence over external research.
- For freshness and evidence checks, assess whether the target artifact tells the agent when current information matters, which sources to prefer, and how to degrade when fresh evidence is unavailable.
- Do not spend prompt budget on provider-selection logic unless the target artifact explicitly depends on an external provider and that dependency changes the assessment.

If the artifact claims research capability, verify:
- current-information trigger boundaries
- source selection rules
- citation or evidence expectations
- fallback behavior when freshness cannot be guaranteed

## References

Load these files as needed:
- `references/quality-rubric.md`
- `references/anti-patterns.md`
- `references/artifact-adapters.md`
- `references/finding-to-advice.md`
- `references/runtime-targets.md`
- `references/test-cases.md`
- `references/subagent-patterns.md`
- `references/USAGE.md`
