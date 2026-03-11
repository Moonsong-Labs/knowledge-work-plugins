# Test Cases

Use these prompts and checks to validate the topology pass, file reviewers, and final synthesis.

## Topology Review

Validate these scenarios:
- a well-formed skill satisfying `DISCLOSURE-01` and `TOPOLOGY-01`
- a skill with a support file linked only from another support file (`TOPOLOGY-01`)
- a skill with a broken reference from `SKILL.md` (`DISCLOSURE-01`)
- a skill with orphaned examples or stale `agents/openai.yaml` (`DISCLOSURE-01` or `METADATA-01`)
- a standalone agent definition with no linked support files

Expected checks:
- broken or stale paths are caught as `bundle` findings
- multi-hop discovery is caught as `depth`
- file sprawl is caught as `fragmentation`

## File Review

Validate these scenarios:
- strong primary `SKILL.md` satisfying `TRIGGER-01`, `TRIGGER-02`, and `STRUCTURE-01`
- weak `SKILL.md` with broad trigger language or vague operational guidance (`TRIGGER-01`, `STRUCTURE-01`)
- strong example file that matches the current JSON contract
- weak example file that is generic or still uses legacy score-sheet language (`EXAMPLE-01`)
- stale or misleading `agents/openai.yaml` (`METADATA-01`)
- broad, tool-heavy standalone agent definition

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
- shared-standard findings can cite rule IDs without changing the JSON shape
