## Skill Assessment: release-notes-editor

### Verdict
ADOPT

### Artifact Type
Claude subagent

### Existence Test
Pass. The subagent has a focused purpose, least-privilege tool access, and enough concrete instruction to produce repeatable release-note drafts.

### Fitness Summary
This subagent is narrow, executable, and appropriately constrained. It states its scope, required output format, and escalation boundaries without pretending to be a general assistant.

### Scores
- Trigger Precision: 5/5
- Unique Knowledge Density: 4/5
- Executable Workflow Clarity: 5/5
- Decision Branches and Fallbacks: 4/5
- Progressive Disclosure and Resource Design: 4/5
- Freshness and Evidence Policy: 3/5
- Examples and Testability: 5/5
- Advice Quality: 4/5
- Overall: 4.4/5

### Blocking Gaps
- None.

### What Already Works
- The subagent declares a single job: turn commits and issue context into release notes.
- Tool access is limited to the sources it actually needs.
- The prompt includes examples and a fixed output structure, which reduces ambiguity.

### Advice by Failure Mode
- Failed test: `Review this subagent that has a narrow purpose but no examples or output contract.`
  Why it passes: this subagent already provides both.
  Advice: add one branch for missing issue metadata so the fallback behavior stays explicit.

### Suggested Test Prompts
- `Use the release-notes-editor subagent to draft notes for the last 15 commits.`
- `Ask the subagent to proceed when two commits lack linked issues and verify its fallback text.`

### Rewrite Brief
No rewrite required. Optional tightening: add one explicit fallback for incomplete issue metadata.
