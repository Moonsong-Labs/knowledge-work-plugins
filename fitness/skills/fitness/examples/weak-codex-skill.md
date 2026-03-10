## Skill Assessment: universal-research-helper

### Verdict
RETHINK

### Artifact Type
Codex skill

### Existence Test
Fail. The artifact reads like a generic tutorial on "doing research" and does not encode enough reusable structure to justify existing as a skill.

### Fitness Summary
The description is broad, the body repeats common prompting advice, and the workflow does not define output shape, source rules, or failure handling. It is structurally valid markdown, but not a worthwhile reusable capability yet.

### Scores
- Trigger Precision: 3/5
- Unique Knowledge Density: 1/5
- Executable Workflow Clarity: 3/5
- Decision Branches and Fallbacks: 2/5
- Progressive Disclosure and Resource Design: 3/5
- Freshness and Evidence Policy: 1/5
- Examples and Testability: 2/5
- Advice Quality: 3/5
- Overall: 2.2/5

### Blocking Gaps
- The skill fails the existence test because it mostly restates generic research advice.
- The trigger is broad enough that it would fire for almost any information request.
- The workflow has no output contract or fallback when current sources are unavailable.

### What Already Works
- The draft at least attempts to separate core steps from references.

### Advice by Failure Mode
- Finding: Trigger fog.
  Failed test: `Give me general advice on writing better prompts.`
  Why it matters: the skill would likely trigger on unrelated tasks.
  Advice: rewrite the description to target one concrete research job and name clear non-goals.
- Finding: Generic wrapper.
  Failed test: `What reusable knowledge would be lost if this artifact disappeared?`
  Why it matters: nothing substantial is lost beyond generic prompting advice.
  Advice: either add domain-specific source policy, output contract, and fallback logic or collapse this into a one-off prompt.
- Finding: Stale research posture.
  Failed test: `Review this research skill that claims to answer "latest" questions with citations.`
  Why it matters: time-sensitive claims are unsafe without freshness rules.
  Advice: add source preference order, freshness triggers, and a fallback for missing current evidence.

### Suggested Test Prompts
- `Assess whether this skill should trigger on a request for general writing help.`
- `Use this skill for a latest-news task and show how it handles stale or missing sources.`

### Rewrite Brief
Cut the generic tutorial material. Rebuild around one research workflow with a narrow trigger, explicit source policy, output sections, and missing-evidence fallback.
