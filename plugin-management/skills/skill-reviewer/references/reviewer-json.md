# Reviewer JSON Contract

Topology reviewers and file reviewers must return strict JSON only. No Markdown wrappers, commentary, or extra keys.

## Object Shape

```json
{
  "file": "skills/foo/SKILL.md",
  "role": "primary",
  "status": "needs_improvement",
  "findings": [
    {
      "priority": "P2",
      "kind": "trigger",
      "title": "[TRIGGER-01] Trigger fog",
      "message": "The description is broader than the workflow it actually teaches.",
      "evidence": "The description promises general research help, but the body only covers market briefs.",
      "fix": "Rewrite the description around market-brief work and add a near-miss boundary."
    }
  ]
}
```

## Fields

- `file`: artifact-relative path under review
- `role`: one of `topology`, `primary`, `reference`, `example`, `metadata`, `subagent`
- `status`: `good`, `needs_improvement`, or `rethink`
- `findings`: array of finding objects; use an empty array when the file is clean

## Finding Fields

- `priority`: `P1`, `P2`, or `P3`
- `kind`: `formatting`, `depth`, `fragmentation`, `coherence`, `trigger`, `pattern`, `metadata`, `examples`, `tool_scope`, or `bundle`
- `title`: short label; prefix with `[RULE-ID]` when the issue violates the shared skill standard
- `message`: what is wrong
- `evidence`: concrete local evidence
- `fix`: smallest useful repair move

## Status Guidance

- `good`: no material issues, or only minor P3 notes
- `needs_improvement`: artifact is locally useful but has fixable issues
- `rethink`: the file or bundle shape is locally misleading, broken, or wrong for its role

The final artifact status is decided by the synthesizer, not by averaging file statuses.
