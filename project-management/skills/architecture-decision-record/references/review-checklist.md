# ADR Review Checklist

Use this before marking an ADR accepted or when the user asks for a review.

## Review Modes

| Mode | Goal | Focus |
|------|------|-------|
| Draft coach | Improve a work-in-progress ADR | Missing context, options, drivers, and readability |
| Stakeholder review | Decide whether affected parties can agree | Consequences, ownership, risk, and traceability |
| Design authority | Confirm architectural adequacy | Rationale, quality attributes, constraints, and compliance |
| Template check | Confirm MADR/log consistency | Headings, metadata, status, filename, links |

State the mode if the user did not.

## Author Checklist

Before accepting an ADR, verify:

* The ADR records one decision.
* The problem is significant enough to preserve.
* The context names the affected system, stakeholder, requirement, or risk.
* The decision question is clear.
* The considered options can plausibly solve the problem.
* The options are at the same abstraction level.
* At least two real options are documented, or the ADR explains why only one option is feasible.
* The decision drivers are criteria, not disguised solutions.
* Conflicting drivers are prioritized or discussed.
* The chosen option is named exactly as it appears in `Considered Options`.
* The rationale explains why the chosen option satisfies the drivers.
* Positive and negative consequences are recorded objectively.
* Operational, maintenance, migration, security, cost, and stakeholder consequences are covered when relevant.
* Confirmation, success criteria, kill criteria, fallback, or review date exists when the decision is risky or experimental.
* Related tickets, RFCs, PRs, benchmarks, diagrams, and prior ADRs are linked.
* Status, date, decision-makers, consulted, and informed fields are accurate if used.
* Accepted decisions are not silently rewritten when superseding is more honest.

## Reviewer Checklist

Ask these questions:

* Is the problem relevant enough for an ADR?
* Are valid options missing?
* Do listed options actually solve the stated problem?
* Are the drivers mutually clear enough to judge the options?
* If drivers conflict, is their priority visible?
* Does the chosen option solve the problem in this context?
* Is the decision rationale convincing and evidence-backed?
* Are positive and negative consequences reported without hiding uncomfortable tradeoffs?
* Is the chosen solution actionable?
* Can the decision be traced back to requirements, incidents, constraints, or stakeholder concerns?
* Does the ADR define a validity period, review date, or confirmation check when needed?
* Is the language factual, precise, and free of subjective claims or loopholes?

## Finding Priorities

Use these priorities when returning review findings:

| Priority | Meaning |
|----------|---------|
| P1 | Decision is misleading, incomplete, or unsafe to accept without revision |
| P2 | ADR is useful but missing important rationale, evidence, consequences, or confirmation |
| P3 | Clarity, style, local convention, or polish issue |

## Review Output

Return findings first:

```text
P1 - Missing real alternatives
The ADR compares managed Postgres to "build a database", which is not a real alternative in this context.
Fix: replace the dummy option with self-managed Postgres or the existing event store, then compare against the same drivers.
```

Then include:

* What is already sound.
* Open questions.
* Suggested review disposition: `accept`, `accept after fixes`, `needs rewrite`, or `supersede`.
