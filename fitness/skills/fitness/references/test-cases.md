# Test Cases

Use these prompts and checks to validate both the target artifact and the assessment.

## Existence Tests

- Ask: "What reusable knowledge would be lost if this artifact disappeared?"
- Ask: "Could this be replaced by a one-off prompt without meaningful degradation?"
- Fail the existence test if the answers point to generic advice, an obvious tool wrapper, or a scope that is too broad to execute consistently.

## Codex Skill Prompts

- Direct hit: `Audit our vendor-risk SKILL.md and tell me whether it is specific enough to keep.`
- Near miss: `Give me general advice on writing better prompts.`
- Freshness case: `Review this research skill that claims to answer "latest" questions with citations.`
- Failure path: `Assess this skill that assumes a CLI is installed and never says what to do if it is missing.`

## Claude Subagent Prompts

- Direct hit: `Review this release-notes subagent for focused scope and tool use.`
- Near miss: `Make my whole prompt library better.`
- Tool-overreach case: `Assess this subagent that requests Bash, browser, and Slack for a formatting task.`
- Structure case: `Review this subagent that has a narrow purpose but no examples or output contract.`

## Assessment Output Checks

Every `IMPROVE`, `RETHINK`, or `REJECT` review should include:
- at least one failed test prompt
- at least one concrete remediation move
- at least one note about what to cut, add, or move

Every `ADOPT` review should still include:
- one regression prompt that would protect against future drift
- one optional tightening suggestion when useful
