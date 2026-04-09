<!-- Full MADR (Markdown Any Decision Records) template. -->
<!-- Sections marked "Optional" can be removed for a minimal ADR. -->
<!-- Source: https://github.com/adr/madr -->

<!-- Optional: YAML frontmatter. Remove the entire block if not needed. -->
---
status: "{proposed | rejected | accepted | deprecated | superseded by ADR-NNNN}"
date: {YYYY-MM-DD when the decision was last updated}
decision-makers: {list everyone involved in the decision}
consulted: {list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication}
informed: {list everyone who is kept up-to-date on progress; and with whom there is a one-way communication}
---

# {Short title, representative of solved problem and found solution}

## Context and Problem Statement

{Describe the context and problem statement, e.g., in free form using two to three sentences or in the form of an illustrative story. You may want to articulate the problem in form of a question and add links to collaboration boards or issue management systems. Make the scope of the decision explicit, for instance by calling out or pointing at structural architecture elements (components, connectors, ...).}

<!-- Optional section. Remove if not needed. -->
## Decision Drivers

* {Decision driver 1, e.g., a desired software quality, faced concern, constraint, or force}
* {Decision driver 2}

## Considered Options

* {Title of option 1}
* {Title of option 2}
* {Title of option 3}

## Decision Outcome

Chosen option: "{title of option}", because {justification. e.g., only option which meets k.o. criterion decision driver | which resolves force {force} | comes out best (see below)}.

<!-- Optional section. Remove if not needed. -->
### Consequences

* Good, because {positive consequence, e.g., improvement of one or more desired qualities}
* Bad, because {negative consequence, e.g., compromising one or more desired qualities}

<!-- Optional section. Remove if not needed. -->
### Confirmation

{Describe how the implementation or compliance of the ADR can be confirmed. Is there any automated or manual fitness function? If so, list it and explain how it is applied. Is the chosen design and its implementation in line with the decision? E.g., a design review, code review, or a test with a library such as ArchUnit can help validate this.}

<!-- Optional section. Remove if not needed. -->
## Pros and Cons of the Options

### {Title of option 1}

{Example, description, or pointer to more information.}

* Good, because {argument a}
* Good, because {argument b}
<!-- Use "neutral" if the given argument weights neither for good nor bad -->
* Neutral, because {argument c}
* Bad, because {argument d}

### {Title of option 2}

{Example, description, or pointer to more information.}

* Good, because {argument a}
* Bad, because {argument b}

<!-- Optional section. Remove if not needed. -->
## More Information

{Additional evidence/confidence for the decision outcome, team agreement on the decision, when/how the decision should be realized, and if/when it should be re-visited. Links to other decisions and resources might appear here as well.}
