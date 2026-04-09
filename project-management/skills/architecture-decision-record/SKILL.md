---
name: architecture-decision-record
description: "Use when choosing between competing technical approaches, recording why an architecture decision (ADR) was made, or revisiting a previous ADR"
---

# Architecture Decision Record

## Overview

Create architecture decision records (ADRs) following the [MADR](https://github.com/adr/madr) (Markdown Any Decision Records) standard. ADRs capture the context, options considered, and rationale behind significant architecture decisions.

The [ADR template](adr-template.md) contains the full MADR document structure ready to copy into a project. Optional sections are marked with HTML comments and can be removed for a minimal ADR. This skill describes when and how to use it.

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

Use the [plan location discovery](../../shared/plan-location-discovery.md) process to find the right directory. When searching for existing directories, also check for ADR-specific locations: `docs/decisions/`, `docs/adr/`, `docs/ADRs/`, `docs/architecture/decisions/`. If no ADR directory exists, default to `docs/decisions/`.

Announce the chosen path and wait for user confirmation before writing.

### 3. Determine Next Number

List existing ADRs in the directory and use the next sequential number. Pad with leading zeros to match existing convention (e.g., `0001`, `0012`). Default to 4-digit padding.

### 4. Walk Through MADR Sections

Guide the user through each section using the [ADR template](adr-template.md). Do not skip required sections. For optional sections, ask if the user wants to include them. A minimal ADR only needs the three required sections.

**Required sections:**
- Context and Problem Statement
- Considered Options
- Decision Outcome

**Optional sections (remove if not needed):**
- YAML frontmatter (status, date, decision-makers, consulted, informed)
- Decision Drivers
- Consequences (Good/Bad)
- Confirmation (how to verify the decision was implemented correctly)
- Pros and Cons of the Options
- More Information (links, references, related ADRs)

### 5. Write the ADR

Copy the template and fill in each section. File naming: `NNNN-title-in-kebab-case.md`.

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
