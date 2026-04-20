# ADR Section Chooser

Use this when deciding how much MADR structure to include.

## Contents

* [Size Selection](#size-selection)
* [Required Core](#required-core)
* [Optional Sections](#optional-sections)
* [YAML Frontmatter](#yaml-frontmatter)
* [Decision Drivers](#decision-drivers)
* [Consequences](#consequences)
* [Confirmation](#confirmation)
* [Pros and Cons of the Options](#pros-and-cons-of-the-options)
* [More Information](#more-information)

## Size Selection

| Size | Use When | Template |
|------|----------|----------|
| Minimal | Decision is significant but straightforward, low controversy, and already has clear options | `adr-template-minimal.md` |
| Standard | Normal engineering decision with tradeoffs, stakeholders, and implementation follow-through | `adr-template.md`, then remove unused optional sections |
| Full | Decision is high-risk, controversial, cross-team, compliance-relevant, expensive to reverse, or likely to be revisited | `adr-template.md` with all useful optional sections |
| Experimental | Decision is time-boxed, confidence is low, or implementation must be validated before wider rollout | Full template plus confirmation, success/kill criteria, fallback, and review date |
| Backfill | Decision was already made and needs honest historical capture | Standard or full; separate original rationale from hindsight |

## Required Core

Always include:

* Title
* Context and Problem Statement
* Considered Options
* Decision Outcome

Include `Consequences` by default. MADR treats it as optional in the full template, but consequences are usually part of what makes an ADR useful.

## Optional Sections

### YAML Frontmatter

Include when:

* Status needs to be searchable or machine-readable.
* The ADR is part of a formal log.
* Decision-makers, consulted experts, or informed stakeholders matter for accountability.
* The decision may later be deprecated or superseded.

Omit when:

* The local ADR convention uses body fields instead.
* The ADR is a temporary draft in a tool that does not preserve frontmatter.

Use these metadata fields unless the project already has different names:

* `status`
* `date`
* `decision-makers`
* `consulted`
* `informed`

### Decision Drivers

Include when:

* More than one option is plausible.
* Tradeoffs involve quality attributes such as reliability, latency, security, operability, cost, developer experience, or maintainability.
* Reviewers need to judge why one option wins.
* Criteria conflict and need priority.

Omit only when the decision is small and the outcome rationale already names the decisive constraint.

Good drivers are decision criteria, not implementation steps. Prefer "Minimize operational burden for a two-person on-call rotation" over "Use managed service".

### Consequences

Include by default for accepted or proposed ADRs.

Good consequences:

* Describe the problem and solution space after the decision.
* Include positive and negative effects.
* Cover implementation, operations, maintenance, migration, security, cost, and stakeholder impact when relevant.
* Tie back to drivers.

Bad consequences:

* Repeat the decision statement.
* List only benefits.
* Hide long-term risks.

### Confirmation

Include when:

* The decision must be implemented or enforced.
* Compliance can drift over time.
* Architecture, dependency, security, or operational checks are available.
* The decision is experimental, high-risk, or time-boxed.

Use concrete checks:

* Code review verifies all new writes use the chosen storage path.
* CI blocks forbidden dependencies.
* Architecture tests assert module boundaries.
* Dashboards show rollout SLOs for two releases.
* Security review confirms data classification assumptions.

For experimental ADRs, include:

* Success criteria.
* Kill criteria.
* Fallback plan.
* Review date.

### Pros and Cons of the Options

Include when:

* There are multiple credible options.
* The choice is contentious.
* The decision will be reviewed by people not present for the discussion.
* The outcome says "comes out best below".

Each option should have:

* A short description or link.
* At least one `Good, because ...` or `Bad, because ...` argument.
* `Neutral, because ...` only for noteworthy factors that do not clearly weigh for or against.

Keep options at the same abstraction level. Do not compare "event-driven architecture" to "Kafka" unless the ADR explains why an architectural style and a product are being compared.

### More Information

Include when there is useful context that should not bloat the core ADR:

* Evidence: tickets, RFCs, PRs, benchmarks, incidents, diagrams, prototypes.
* Assumptions.
* Confidence level.
* Team agreement notes.
* Rollout or migration plan.
* Revisit date or validity period.
* Links to related ADRs.

Use this section for cross-ADR links rather than inventing a separate relationship table unless the project already has one.
