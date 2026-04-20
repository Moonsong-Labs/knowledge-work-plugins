---
# Adapted full ADR template based on MADR.
# Use adr-template-madr-full.md when an exact canonical MADR full template is requested.
# Optional metadata. Remove any field that does not add value.
status: "{proposed | rejected | accepted | deprecated | superseded by ADR-0123}"
date: "{YYYY-MM-DD when the decision was last updated}"
decision-makers:
  - "{name or role of everyone involved in the decision}"
consulted:
  - "{name or role of subject-matter experts or stakeholders consulted through two-way communication}"
informed:
  - "{name or role of people kept up to date through one-way communication}"
---
<!-- markdownlint-disable MD004 -->

# {short title, representative of solved problem and found solution}

## Context and Problem Statement

{Describe the context and problem statement in two to three factual sentences, or as an illustrative story if that better explains the situation. Prefer a question when the decision can be phrased clearly. Include links to issues, RFCs, incidents, benchmarks, or diagrams when they are evidence. Make the scope explicit by naming the affected system, component, connector, workflow, quality attribute, or stakeholder concern.}

<!-- Optional section. Remove if not needed. -->
## Decision Drivers

* {decision driver 1, e.g., desired quality, force, stakeholder concern, constraint, deadline, risk, or requirement}
* {decision driver 2}
* {decision driver 3}

## Considered Options

* {title of option 1}
* {title of option 2}
* {title of option 3}

## Decision Outcome

Chosen option: "{title of option 1}", because {justification, e.g., it is the only option that meets a knockout driver, resolves the most important force, best satisfies the drivers below, or has the best risk/cost tradeoff}.

<!-- Optional section. Remove if not needed. -->
### Consequences

* Good, because {positive consequence, e.g., improvement of one or more desired qualities}
* Bad, because {negative consequence, e.g., compromised quality, implementation cost, operational burden, migration risk, or reduced flexibility}
* Neutral, because {noteworthy effect that is neither clearly positive nor negative}

<!-- Optional section. Remove if not needed. -->
### Confirmation

{Describe how implementation or compliance with this decision can be confirmed. Examples: design review, code review, architecture test, dependency check, operational runbook review, dashboard/alert check, migration rehearsal, security review, or post-release review. Include success criteria, kill criteria, fallback plan, or review date when the decision is experimental or time-sensitive.}

<!-- Optional section. Remove if not needed. -->
## Pros and Cons of the Options

### {title of option 1}

{Example, description, or pointer to more information.}

* Good, because {argument a}
* Good, because {argument b}
<!-- Use "Neutral" if the argument is noteworthy but weighs neither clearly for nor against the option. -->
* Neutral, because {argument c}
* Bad, because {argument d}

### {title of option 2}

{Example, description, or pointer to more information.}

* Good, because {argument a}
* Neutral, because {argument b}
* Bad, because {argument c}

### {title of option 3}

{Example, description, or pointer to more information.}

* Good, because {argument a}
* Bad, because {argument b}

<!-- Optional section. Remove if not needed. -->
## More Information

{Add evidence, assumptions, confidence level, agreement notes, rollout plan, revisit date, related decisions, and links to supporting artifacts. Link large context here rather than embedding it in the ADR.}
