# Subagent Patterns

Use subagents only when they reduce complexity.

## When to use them

- The artifact has three or more reviewable files
- File roles are mixed enough that one reviewer would carry too much context
- Topology review and file review can proceed independently
- The host supports real subagents or parallel reviewer calls

## Recommended subagents

### Topology Reviewer

Use for:
- direct discoverability
- depth and fragmentation
- broken, stale, or orphaned references
- bundle shape problems

Prompt shape:
`Review this artifact topology only. Use the provided manifest and primary file. Check direct discoverability, depth, fragmentation, broken references, and stale paths. Return strict JSON only using the reviewer contract.`

### File Reviewer

Use for:
- one file at a time
- role-specific quality checks
- trigger, pattern, metadata, example, or tool-scope findings that are visible locally

Prompt shape:
`Review this file in isolation with the supplied role and minimal artifact context. Do not make package-level judgments. Return strict JSON only using the reviewer contract.`

### Synthesizer

Use for:
- deduping topology and file findings
- collapsing repeated issues into one package-level issue
- deciding the final status
- producing the refactor plan

Prompt shape:
`Given topology JSON and file-review JSON, dedupe overlapping findings, add only package-level judgments, decide final status, and return the final report sections. Do not emit numeric scores.`

## Constraints

- Keep subagents narrow
- Do not create a fixed pipeline for tiny artifacts
- Do not ask file reviewers to decide whether the artifact deserves to exist
- If the host cannot dispatch subagents, run the same reviewer contracts inline
