---
name: architecture-decision-record
description: "Use when choosing between competing technical approaches, recording why an architecture decision (ADR) was made, or revisiting a previous ADR"
---

# Architecture Decision Record

## Overview

Create architecture decision records (ADRs) following the [MADR](https://github.com/adr/madr) (Markdown Any Decision Records) standard. ADRs capture the context, options considered, and rationale behind significant architecture decisions.

**Announce at start:** "I'm using the architecture-decision-record skill to create an ADR following the MADR standard."

## When to Use

- Making a significant technical or architecture decision
- Choosing between multiple implementation approaches
- Documenting a decision that was already made but not recorded
- Revisiting or superseding a previous decision

## When NOT to Use

- Trivial implementation choices that don't affect architecture
- Decisions already documented elsewhere (e.g., in a spec or design doc)

## Workflow

### 1. Identify the Decision

Ask:
- What problem are we solving?
- What constraints are we working within?
- Who are the decision-makers and who should be consulted?

### 2. Discover ADR Location

Search for existing ADR directories in order:

1. Check project instructions (`CLAUDE.md`, `AGENTS.md`) for ADR location guidance
2. Look for existing directories: `docs/decisions/`, `docs/adr/`, `docs/ADRs/`, `docs/architecture/decisions/`
3. If found, check existing files for naming patterns (numbered prefix like `0001-`, `adr-001-`, etc.)
4. If no ADR directory exists, default to `docs/decisions/`

Announce the chosen path and wait for user confirmation before writing.

### 3. Determine Next Number

List existing ADRs in the directory and use the next sequential number. Pad with leading zeros to match existing convention (e.g., `0001`, `0012`). Default to 4-digit padding.

### 4. Walk Through MADR Sections

Guide the user through each section. Do not skip sections without asking.

**Required sections:**
- Context and Problem Statement
- Considered Options
- Decision Outcome

**Optional but recommended sections:**
- Decision Drivers
- Consequences (Good/Bad)
- Pros and Cons of the Options

**Optional sections:**
- Confirmation (how to verify the decision was implemented correctly)
- More Information (links, references, related ADRs)

### 5. Write the ADR

Use the MADR template below. File naming: `NNNN-title-in-kebab-case.md`.

## MADR Template

```markdown
---
status: {proposed | accepted | rejected | deprecated | superseded by ADR-NNNN}
date: {YYYY-MM-DD}
decision-makers: {list everyone involved in the decision}
consulted: {list everyone whose opinions are sought; two-way communication}
informed: {list everyone kept up-to-date; one-way communication}
---

# {Short title, representative of solved problem and found solution}

## Context and Problem Statement

{Describe the context and problem statement, e.g., in free form using two to three
sentences or in the form of a question. Consider adding links to collaboration
boards or issue trackers.}

## Decision Drivers

* {Decision driver 1, e.g., a desired quality, constraint, or force}
* {Decision driver 2}

## Considered Options

* {Title of option 1}
* {Title of option 2}
* {Title of option 3}

## Decision Outcome

Chosen option: "{title of option}", because {justification}.

### Consequences

* Good, because {positive consequence}
* Bad, because {negative consequence}

### Confirmation

{How the implementation or compliance of the ADR can be confirmed. E.g., a design
review, code review, or test.}

## Pros and Cons of the Options

### {Title of option 1}

{Description or pointer to more information.}

* Good, because {argument a}
* Good, because {argument b}
* Neutral, because {argument c}
* Bad, because {argument d}

### {Title of option 2}

{Description or pointer to more information.}

* Good, because {argument a}
* Bad, because {argument b}

## More Information

{Additional evidence, links to related ADRs, or references.}
```

## Statuses

| Status | Meaning |
|--------|---------|
| proposed | Decision is under discussion, not yet agreed upon |
| accepted | Decision has been agreed upon and should be followed |
| rejected | Decision was considered but not adopted |
| deprecated | Decision is no longer relevant or recommended |
| superseded by ADR-NNNN | Replaced by a newer decision; link to the successor |

When superseding an ADR, update the old ADR's status to point to the new one.

## Common Mistakes

- Writing the ADR after implementation is done and framing it as a foregone conclusion
- Listing options without genuine pros and cons analysis
- Missing the "why" in Decision Outcome, just stating the choice without justification
- Not listing who was consulted or informed
- Creating ADRs for trivial decisions that don't warrant the overhead
