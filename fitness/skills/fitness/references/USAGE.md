# Usage

Invoke this skill by asking for a fitness assessment of a concrete artifact.

Examples:
- `Audit skills/market-brief/SKILL.md as a knowledge skill`
- `Assess this Claude subagent for trigger quality and tool overreach`
- `Review this research skill and tell me if it actually deserves to exist`

Expected flow:
1. Read the target artifact and any directly referenced support files.
2. Run the existence test before scoring.
3. Apply the rubric, anti-patterns, artifact adapters, and test-case references.
4. Produce an opinionated assessment with fixed sections.
5. Ask whether rewrite guidance should run.

Expected output sections:
- `Verdict`
- `Artifact Type`
- `Existence Test`
- `Fitness Summary`
- `Scores`
- `Blocking Gaps`
- `What Already Works`
- `Advice by Failure Mode`
- `Suggested Test Prompts`
- `Rewrite Brief`

Every negative finding must map to:
- one failed test or missing behavior
- one concrete remediation pattern
