# Finding to Advice

Every negative finding must map to both a failed test and a remediation pattern.

## Mapping Rules

Use this shape:
- `Finding`: what is wrong
- `Failed test`: the prompt or check that exposes it
- `Why it matters`: how it weakens reusability
- `Advice`: the smallest concrete fix

## Common Failure Modes

### Trigger Fog
- Failed test: a near-miss prompt would still trigger the artifact
- Advice: rewrite the `description` or opening purpose statement with explicit inclusion and exclusion language

### Generic Wrapper
- Failed test: removing the artifact would not meaningfully reduce work for a capable base model
- Advice: either add reusable decision structure, domain-specific heuristics, or collapse the artifact into a one-off prompt

### Missing Decision Surface
- Failed test: the first missing prerequisite or environment variation leaves no next step
- Advice: add branches for absent tools, stale inputs, missing auth, or partial failure

### Missing Output Contract
- Failed test: two reasonable agents would produce materially different outputs
- Advice: specify required sections, files, fields, or success checks

### Tool Overreach
- Failed test: the artifact requests tools or permissions that are not needed for its primary task
- Advice: remove unnecessary tools and state when escalation is allowed

### Stale Research Posture
- Failed test: the artifact handles time-sensitive questions without source or freshness rules
- Advice: add source preference, freshness checks, and a safe fallback when current evidence is unavailable

### Dead Bundle
- Failed test: the artifact references files that do not exist or do not materially improve execution
- Advice: delete the reference or add the missing file with a clear reason to exist

### Untestable Advice
- Failed test: no concrete prompt, example, or scenario can confirm the artifact works as intended
- Advice: add trigger examples, regression prompts, and at least one failure-mode scenario
