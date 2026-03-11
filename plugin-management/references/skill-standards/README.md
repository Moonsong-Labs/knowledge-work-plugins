# Skill Standards

This file is the single source of truth for repo-local skill best practices.

Use it when:
- authoring or editing a skill
- scaffolding a new skill or plugin
- reviewing a reusable artifact bundle or standalone agent definition for quality

`writing-skills`, `create-plugin`, and `skill-reviewer` should point here rather than restating these rules.

## Upstream References

These local rules are aligned with, but not replaced by, the upstream Anthropic guidance:

- Best practices guide: <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>
- Skills overview: <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>
- Anthropic `skill-creator`: <https://github.com/anthropics/skills/tree/main/skills/skill-creator>

## How To Use This Standard

- Authors: apply the rule IDs while drafting, then use `writing-skills` for the RED/GREEN/REFACTOR workflow.
- Scaffolders: use these rules as the target contract for new skill stubs and validation checks.
- Reviewers: cite rule IDs in findings when a failure is a standards violation, for example `[TRIGGER-01] Trigger fog`.

## Naming And Frontmatter

### `NAME-01` Skill names are searchable slugs

- Use letters, numbers, and hyphens only.
- Prefer short, task-shaped names over abstract nouns.
- Name the reusable capability, not the story of how you discovered it.

Examples:
- `condition-based-waiting`
- `writing-skills`
- `root-cause-tracing`

### `FRONTMATTER-01` Frontmatter stays minimal

- `SKILL.md` frontmatter contains only `name` and `description`.
- Keep the combined frontmatter under 1024 characters.
- Do not hide workflow rules or metadata in extra keys.

### `TRIGGER-01` Descriptions define when to load, not what the skill does

- Start with `Use when...`.
- Write in third person.
- Describe triggering conditions, symptoms, or contexts.
- Never summarize the workflow in the description.

Good:

```yaml
description: Use when tests have race conditions, timing dependencies, or pass/fail inconsistently
```

Bad:

```yaml
description: Use when testing async code - write waits, poll until stable, and clean up after each test
```

### `TRIGGER-02` Trigger boundaries are concrete

- Include the real problem, not vague category labels.
- Include near misses or non-goals when the boundary is easy to miss.
- Prefer symptoms and tasks over implementation trivia unless the skill is technology-specific.

### `SEARCH-01` Search terms are deliberate

- Include words an agent would actually search for: symptoms, commands, file types, tool names, or common error strings.
- Put the most important searchable terms early in the file.

## Skill Body

### `STRUCTURE-01` The body teaches a reusable capability

- Skills are reference guides for reusable techniques, patterns, workflows, or tools.
- A skill should not read like a narrative postmortem or a one-off runbook.
- Include output expectations, fallback behavior, or escalation points when the task is fragile.

### `STRUCTURE-02` `SKILL.md` stays lean and scan-friendly

The exact headings can vary, but the primary file should make these easy to find:

- what the skill is
- when to use it and when not to
- the core workflow or pattern
- where heavier details live
- common mistakes or failure modes

Use small tables or short lists when they improve scanning. Avoid filler prose.

### `EXAMPLE-01` Examples are realistic and current

- One excellent example is better than many mediocre ones.
- Examples should match the current contract and expected output shape.
- Avoid generic filler, stale formats, or contrived toy scenarios.

## Progressive Disclosure And Bundle Shape

### `DISCLOSURE-01` Support files exist to reduce primary-file load

- Keep `SKILL.md` focused on the core workflow.
- Move heavy references, reusable tools, or bulky examples into support files only when they materially improve execution.
- Prefer one level of supporting files over deep chains of indirection.

### `TOPOLOGY-01` Load-bearing files are directly discoverable

A file is load-bearing if the artifact depends on it for correct execution.

Load-bearing files should be directly named by the primary artifact, with one exception:
- required runtime metadata such as `agents/openai.yaml`

Do not make the reader discover required behavior by hopping through support files.

### `TOPOLOGY-02` Avoid fragmentation and multi-hop bundles

- Do not spread one small workflow across many tiny files without a clear gain.
- Do not hide required guidance behind `references/index.md` style hubs.
- Do not keep orphaned examples, stale paths, or support files that no longer change behavior.

### `TOKEN-01` Treat the context window as a shared resource

- Keep repeated skills lean.
- Do not duplicate other skills or tool help text when a short reference is enough.
- Prefer concise examples and cross-references over long explanations of obvious mechanics.

## Metadata And Runtime Parity

### `METADATA-01` Runtime metadata matches the real job

- Runtime metadata such as `agents/openai.yaml`, plugin metadata, and display names must match the artifact's actual trigger scope and behavior.
- Metadata must not promise unsupported outputs or artifact types.

### `RUNTIME-01` Multi-runtime artifacts stay aligned

If a capability ships through multiple host-specific definition files:

- keep the same core job
- keep the same trigger scope
- keep the same output/status contract unless the host truly requires a difference
- record any real runtime-specific differences explicitly

## Optional Presentation Guidance

These are secondary to the rules above, but still useful defaults:

- Use flowcharts only for non-obvious decisions or loops where agents commonly stop too early.
- Keep code examples complete enough to adapt, not decorative.
- Prefer one concrete language example over multi-language dilution.

## Reviewer Mapping

Reviewer-local docs should map shared-rule failures into reviewer findings instead of redefining the rules:

- trigger problems -> `trigger`
- metadata drift -> `metadata`
- structural or syntax failures -> `formatting`
- weak reusable guidance or missing output contract -> `pattern`
- direct-discoverability failures -> `depth` or `bundle`
- fragmentation -> `fragmentation`

If a finding is reviewer-only, such as overly broad tool access in a standalone agent definition, it does not need a shared rule ID.
