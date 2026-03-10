## Skill Assessment: market-brief-research

### Verdict
ADOPT

### Artifact Type
Codex skill

### Existence Test
Pass. The skill encodes reusable research structure, source discipline, and fallback behavior that a base model would not reliably infer from a bare prompt.

### Fitness Summary
This is a real knowledge skill. The trigger is narrow, the workflow is executable, and the skill explains how to handle stale or missing evidence without overloading the main file.

### Scores
- Trigger Precision: 5/5
- Unique Knowledge Density: 5/5
- Executable Workflow Clarity: 5/5
- Decision Branches and Fallbacks: 4/5
- Progressive Disclosure and Resource Design: 4/5
- Freshness and Evidence Policy: 5/5
- Examples and Testability: 4/5
- Advice Quality: 4/5
- Overall: 4.7/5

### Blocking Gaps
- None.

### What Already Works
- The description clearly limits the skill to market-brief research tasks with current-source requirements.
- The workflow defines ordered steps, expected output sections, and citation rules.
- References hold source-selection detail and examples without bloating `SKILL.md`.

### Advice by Failure Mode
- Failed test: `Review this research skill that claims to answer "latest" questions with citations.`
  Why it passes: the skill already defines freshness triggers, preferred sources, and fallback behavior.
  Advice: add one explicit partial-failure branch for unavailable premium research tools.

### Suggested Test Prompts
- `Use this skill to build a market brief on the latest UK EV charging regulation updates.`
- `Use this skill when official sources disagree on dates and tell me how it resolves the conflict.`

### Rewrite Brief
No rewrite required. Optional tightening: add one regression example covering an unavailable research provider.
