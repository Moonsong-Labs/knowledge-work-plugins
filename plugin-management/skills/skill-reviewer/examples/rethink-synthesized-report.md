## Status
rethink

## Key Findings
- `P1` trigger: the primary description is so broad that the artifact would trigger for unrelated help requests.
- `P1` coherence: the primary file promises general research help, but the bundle only teaches one partial workflow.
- `P2` fragmentation: examples and references are split across multiple tiny files that do not add clarity.
- `P2` bundle: one load-bearing example is only discoverable from another support file.

## What To Keep
- The draft shows a real desire to separate core instructions from supporting detail.
- One example contains salvageable source-policy language.

## Refactor Plan
- `rewrite` the primary `description` around one concrete job and add a near-miss boundary.
- `merge` the fragmented support files into one direct reference linked from the primary file.
- `cut` generic tutorial material that a capable base model already knows.
- `relink` the surviving example directly from the primary file so it is not hidden behind another support file.
