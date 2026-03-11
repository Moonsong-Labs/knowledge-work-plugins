# Finding Categories

Use these categories when emitting reviewer findings. Keep the category aligned with the smallest real problem.

## `formatting`

Use for invalid or misleading structure:
- malformed YAML frontmatter
- invalid JSON or metadata shape
- missing required headings or unreadable layout

Typical priority:
- `P1` when the file cannot be consumed reliably
- `P2` when structure is legal but hard to follow

## `depth`

Use for multi-hop discovery problems:
- a load-bearing file is only linked from another support file
- the artifact requires reference chasing to understand core behavior

Typical priority:
- `P1` when the missing direct link hides required behavior
- `P2` when the artifact is still usable but needlessly deep

## `fragmentation`

Use for bundle sprawl:
- too many tiny files for one small workflow
- examples or references split across several narrow files with no clear gain

Typical priority:
- `P2` unless fragmentation directly hides required behavior

## `coherence`

Use for cross-file or intra-file mismatch:
- `description` promises a broader or different job than the body supports
- headings promise capabilities the artifact does not deliver
- runtime docs or metadata describe stale behavior

Common anti-pattern titles:
- `Trigger/body mismatch`
- `Phantom capability`

## `trigger`

Use for activation problems:
- vague or overly broad `description`
- missing near-miss boundaries
- user-facing trigger language that does not match the actual workflow

Common anti-pattern titles:
- `Trigger fog`

## `pattern`

Use for reusable-knowledge failures:
- generic wrapper around one obvious tool call
- tutorial filler instead of operational guidance
- no decision surface for common variation
- no output contract

Common anti-pattern titles:
- `Generic wrapper`
- `Tutorial dump`
- `Missing decision surface`
- `Missing output contract`

## `metadata`

Use for runtime metadata drift:
- stale `agents/openai.yaml`
- misleading display name or default prompt
- mismatch between metadata promise and actual behavior

## `examples`

Use for example quality problems:
- examples are generic, unrealistic, or untestable
- examples contradict the intended workflow
- examples show the old contract instead of the current one

## `tool_scope`

Use for Claude subagent tool issues:
- unnecessary tools
- missing constraints on sensitive tools
- permissions broader than the task requires

## `bundle`

Use for file-set problems:
- broken links
- orphaned load-bearing files
- stale paths to renamed files
- support files that do not materially improve execution

Common anti-pattern title:
- `Dead bundle`
