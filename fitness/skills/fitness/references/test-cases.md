# Test Cases

Use these prompts and checks to validate the topology pass, file reviewers, and final synthesis.

## Topology Review

Validate these scenarios:
- a well-formed skill with direct references only
- a skill with a support file linked only from another support file
- a skill with a broken reference from `SKILL.md`
- a skill with orphaned examples or stale `agents/openai.yaml`
- a standalone Claude subagent with no linked support files

Expected checks:
- broken or stale paths are caught as `bundle` findings
- multi-hop discovery is caught as `depth`
- file sprawl is caught as `fragmentation`

## File Review

Validate these scenarios:
- strong primary `SKILL.md` with a narrow trigger and lean workflow
- weak `SKILL.md` with broad trigger language or vague operational guidance
- strong example file that matches the current JSON contract
- weak example file that is generic or still uses legacy score-sheet language
- stale or misleading `agents/openai.yaml`
- broad, tool-heavy Claude subagent

Expected checks:
- file reviewers stay local and do not make package-level worth-keeping calls
- every finding includes priority, evidence, and a concrete fix
- clean files can return `good` with an empty findings array

## Synthesis

Validate these scenarios:
- repeated file-local findings collapse into one package issue
- description/body mismatch is caught even when no single file calls it out directly
- review order does not change the final result
- small artifacts can skip parallel review without changing the final report format

Expected final output:
- `Status`
- `Key Findings`
- `What To Keep`
- `Refactor Plan`

Regression check:
- no numeric scoring language remains in docs or examples
