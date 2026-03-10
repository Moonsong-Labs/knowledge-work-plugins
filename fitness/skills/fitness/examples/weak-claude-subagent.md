## Skill Assessment: productivity-omni-agent

### Verdict
REJECT

### Artifact Type
Claude subagent

### Existence Test
Fail. The subagent tries to act as a general-purpose assistant, requests excessive tools, and does not provide a focused reusable capability.

### Fitness Summary
This is the wrong abstraction. The scope is broad, tool access is unjustified, and the instructions are too generic to yield repeatable behavior. The artifact would be safer and clearer as several focused subagents or a one-off prompt.

### Scores
- Trigger Precision: 1/5
- Unique Knowledge Density: 1/5
- Executable Workflow Clarity: 1/5
- Decision Branches and Fallbacks: 1/5
- Progressive Disclosure and Resource Design: 2/5
- Freshness and Evidence Policy: 1/5
- Examples and Testability: 1/5
- Advice Quality: 1/5
- Overall: 1.1/5

### Blocking Gaps
- The subagent fails the existence test because it is effectively a general assistant with a name.
- Tool access is far broader than the task requires.
- There is no output contract, escalation policy, or concrete execution pattern.

### What Already Works
- The draft at least implies a desire to centralize repetitive work.

### Advice by Failure Mode
- Finding: Tool overreach.
  Failed test: `Assess this subagent that requests Bash, browser, and Slack for a formatting task.`
  Why it matters: least-privilege is missing, which increases risk and ambiguity.
  Advice: remove tools that are not essential and split unrelated jobs into focused subagents.
- Finding: Trigger fog.
  Failed test: `Make my whole prompt library better.`
  Why it matters: the scope is too broad to trigger consistently or execute well.
  Advice: rewrite the purpose around one concrete job with clear exclusions.
- Finding: Missing output contract.
  Failed test: `Review this subagent that has a narrow purpose but no examples or output contract.`
  Why it matters: different runs will produce inconsistent output.
  Advice: add required output sections, one worked example, and a fallback for missing inputs.

### Suggested Test Prompts
- `Use this subagent for a simple formatting task and inspect whether every declared tool is actually needed.`
- `Try triggering this subagent with a broad "help me with everything" request and verify it refuses to over-trigger.`

### Rewrite Brief
Do not iterate on this shape. Split it into focused subagents with minimum necessary tools, explicit outputs, and clear non-goals.
