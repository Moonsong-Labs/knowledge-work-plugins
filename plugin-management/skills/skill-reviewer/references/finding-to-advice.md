# Synthesis Rules

Use this file during the final pass that turns topology JSON and file-review JSON into one judgment and repair plan.

## Inputs

The synthesizer receives:
- one topology JSON object
- zero or more file-review JSON objects

Do not rewrite those objects. Collate them.

## Dedupe Rules

- Treat findings as duplicates when `file`, `kind`, and `evidence` materially match.
- Prefer the clearer title and fix text when duplicates conflict.
- If the same issue appears across several files, collapse it into one package-level finding in the final report.

## Escalation Rules

- Escalate to `P1` when the artifact has broken references, invalid runtime metadata, unreadable primary structure, or a misleading primary contract.
- Escalate repeated `P2` findings in the same category into one package-level `P1` or high `P2` when they reveal a systemic issue.
- Do not escalate cosmetic issues simply because they are frequent.

## Package-Level Judgments

Only the synthesizer may add findings for:
- description/body mismatch
- overall bundle depth
- overall fragmentation
- worth-keeping judgment for the artifact as a reusable capability

Ask:
- What reusable knowledge would be lost if this artifact disappeared?
- Could a one-off prompt or ordinary documentation replace it without meaningful degradation?

If the answers point to generic advice, an obvious wrapper, or a misleading abstraction, final status should be `rethink`.

## Refactor Plan Rules

Turn findings into concrete moves. Prefer these verbs:
- `keep`
- `cut`
- `move`
- `merge`
- `rewrite`
- `relink`

Each plan item should name:
- the file or file set to change
- the concrete problem being fixed
- the smallest useful change

## Final Status Rules

- `good`: only minor P3 findings, if any, and no package-level concern
- `needs_improvement`: worthwhile artifact with fixable P1 or P2 findings
- `rethink`: structural or conceptual problems make the artifact misleading, too fragmented, or not worth keeping in its current shape

## Final Output Shape

Return these sections only:
- `Status`
- `Key Findings`
- `What To Keep`
- `Refactor Plan`

Use brief prose or flat bullets. Do not emit numeric scores, weighted averages, or redundant restatements of the same issue.
