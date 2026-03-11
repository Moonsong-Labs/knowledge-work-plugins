---
name: fitness
description: Use when auditing or refactoring a skill, skill bundle, or subagent for structure, progressive disclosure, trigger quality, or reusable capability fit.
---

# Fitness

Review reusable agent artifacts as bundles of files, not as essay prompts.

## Supported Artifacts

- Skills rooted at `SKILL.md`
- Subagents with YAML frontmatter
- Directly referenced support files that materially affect behavior, such as `references/`, `examples/`, runtime metadata, or bundled scripts

Do not use this skill for generic prompt review, slash commands, or broad documentation audits with no reusable agent behavior.

## Runtime Mapping

Use `references/runtime-targets.md` as the source of truth for which artifact defines behavior in Codex versus Claude.

## Core Model

This skill does not use weighted scoring.

- Gather structured findings from narrow reviewers.
- Keep package-level judgment in one synthesis pass.
- Prefer direct evidence from local files over generalized taste.
- Judge whether the artifact deserves to exist as a reusable capability only after topology and file review results are in hand.

## Review Workflow

Run this workflow in order for each artifact.

1. Identify the artifact type and the primary file.
   - For skills, primary is `SKILL.md`.
   - For standalone Claude subagents, primary is the agent file.
2. Build a lightweight manifest using normal file discovery and link reading.
   - Track reviewable files, file roles, direct references, inbound references, and any obviously stale or missing paths.
   - Treat `agents/openai.yaml` as a required metadata file for Codex skills even if it is not linked from `SKILL.md`.
3. Run a `Topology Reviewer`.
   - Use `references/topology-rules.md` for direct-discoverability, depth, fragmentation, and bundle checks.
   - Return strict JSON only, following `references/reviewer-json.md`.
4. Run `File Reviewer` passes on the primary file and any load-bearing support files.
   - Use `references/artifact-adapters.md` for role-specific expectations.
   - Use `references/anti-patterns.md` for finding kinds and priority calibration.
   - When there are three or more reviewable files and the host supports subagents, parallelize. Otherwise run the same reviewer contract inline.
   - Each file reviewer returns strict JSON only.
5. Run one synthesis pass.
   - Use `references/finding-to-advice.md`.
   - Dedupe repeated findings, collapse repeated file-local problems into package-level issues, and add cross-file judgments that no single file reviewer can make.
   - Decide whether the artifact is `good`, `needs_improvement`, or `rethink`.
6. Produce a compact repair plan.
   - Preserve what is already working.
   - Turn each accepted finding into a concrete refactor move.
   - Only expose raw reviewer JSON when the user explicitly asks for it.

## Reviewer Shapes

Use narrow reviewers only when they reduce complexity. See `references/subagent-patterns.md`.

### Topology Reviewer

Input:
- artifact manifest
- primary file path
- minimal artifact type context

Checks:
- formatting or naming failures that block use
- direct discoverability of load-bearing files
- broken, stale, or orphaned references
- excessive depth and over-fragmentation
- bundle shape that makes the artifact hard to load or trust

Output:
- strict JSON only
- `role` must be `topology`

### File Reviewer

Input:
- one file
- one file role
- primary file summary and any minimal context needed to judge the file fairly

Roles:
- `primary`
- `reference`
- `example`
- `metadata`
- `subagent`

Checks:
- local formatting and clarity
- trigger contract quality
- good and bad patterns
- output or example usefulness
- metadata accuracy
- role-specific usefulness versus duplication

Output:
- strict JSON only
- findings must be evidence-backed and repairable

### Synthesizer

Input:
- topology JSON
- all file-review JSON

Responsibilities:
- dedupe overlapping findings
- collapse repeated issues into one package-level issue
- add cross-file findings such as description/body mismatch or bundle incoherence
- decide final status
- produce the final fix plan

The synthesizer is the only reviewer allowed to decide whether the artifact deserves to exist as a reusable capability.

## Final Output

Default to these user-facing sections:
- `Status`
- `Key Findings`
- `What To Keep`
- `Refactor Plan`

Status values:
- `good`: only minor P3 issues or no material issues
- `needs_improvement`: worthwhile artifact with fixable issues
- `rethink`: structurally misleading, too fragmented, or not worth keeping in its current shape

## Interaction Policy

Default to completing the review without interruption.

Ask a user question only when a missing fact would materially change:
- the final status
- whether a file is load-bearing
- whether a finding is structural versus cosmetic
- the repair plan

Otherwise make a reasonable assumption, state it briefly, and continue.

## Evidence Policy

- Prefer local artifact evidence over external research.
- Use file paths, headings, descriptions, and direct references as evidence.
- Do not invent file relationships that are not present in the artifact.
- Do not use numeric scores or weighted averages.

## References

Load these files as needed:
- `references/anti-patterns.md`
- `references/artifact-adapters.md`
- `references/finding-to-advice.md`
- `references/reviewer-json.md`
- `references/runtime-targets.md`
- `references/subagent-patterns.md`
- `references/test-cases.md`
- `references/topology-rules.md`
