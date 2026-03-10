# Quality Rubric

Use a 1-5 score for each dimension.

## Dimensions

1. Trigger Precision
- Description makes the trigger boundary obvious and stays aligned with actual behavior
- The trigger boundary is narrow enough to avoid false positives
- The body stays aligned with the frontmatter promise

2. Unique Knowledge Density
- Contains domain-specific knowledge or reusable operational structure
- Avoids generic prompt-writing advice and tutorial filler
- Teaches something the base model would not reliably infer on its own

3. Executable Workflow Clarity
- Steps are ordered and actionable
- Output contract or success condition is explicit
- A new agent instance could execute the workflow without guessing core behavior

4. Decision Branches and Fallbacks
- Includes branches for important environment or task variation
- States what to do when prerequisites fail or evidence is missing
- Avoids brittle one-path procedures

5. Progressive Disclosure and Resource Design
- Keeps the core workflow in the main artifact
- Pushes bulky detail into references, scripts, or examples only when they add value
- References are coherent, directly linked, and not over-fragmented

6. Freshness and Evidence Policy
- Explains when current information matters
- States source preferences or evidence expectations when claims may go stale
- Includes a safe fallback when freshness cannot be established

7. Examples and Testability
- Provides concrete examples, test prompts, or edge cases where they materially reduce ambiguity
- Makes it easy to tell whether the artifact triggered correctly and behaved correctly
- Supports regression testing after edits

8. Advice Quality
- Gives the agent sharp guidance on tradeoffs, failure modes, or rewrite moves
- Makes remediation obvious when the artifact is incomplete
- Avoids vague exhortations such as "be careful" or "use best practices"

## Overall Score

Use weighted average:
- Trigger Precision 15%
- Unique Knowledge Density 20%
- Executable Workflow Clarity 15%
- Decision Branches and Fallbacks 15%
- Progressive Disclosure and Resource Design 10%
- Freshness and Evidence Policy 10%
- Examples and Testability 10%
- Advice Quality 5%

## Existence Test

Fail the existence test when any of these are true:
- The artifact mostly restates general model knowledge
- It wraps a single obvious tool or prompt with no reusable decision structure
- Its scope is so broad that it cannot give focused, repeatable behavior
- It would be better represented as a one-off prompt, checklist, or ordinary documentation page

Passing the existence test is required for `ADOPT` and normally required for `IMPROVE`.

## Verdict Mapping

- `ADOPT`: overall >= 4.3, passes the existence test, and has no blocking gaps
- `IMPROVE`: overall >= 3.2 and < 4.3, passes the existence test, and is clearly worth keeping
- `RETHINK`: overall >= 2.0 and < 3.2, or fails the existence test but has salvageable pieces
- `REJECT`: overall < 2.0, or fails the existence test in a way that makes the artifact misleading or unnecessary
