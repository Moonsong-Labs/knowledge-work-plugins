---
name: architecture-decision-record
description: "Use when drafting, reviewing, backfilling, or superseding an architecture decision record (ADR/MADR) for a significant technical choice, tradeoff, option comparison, decision rationale, consequences, confirmation, or ADR log maintenance; avoid for trivial implementation notes or broad design documents"
---

# Architecture Decision Record

## Overview

Create and review architecture decision records (ADRs) using MADR 4.0.0 (Markdown Architectural Decision Records). ADRs capture one significant decision, why it mattered, what options were considered, what was chosen, what tradeoffs follow, and how the decision will be confirmed or revisited.

Use the project's existing ADR template and conventions first. Use this bundle when the project has no stronger local convention or when reviewing whether an ADR is complete and useful.

## References

Load only the reference needed for the current task:

- [adr-template.md](adr-template.md): full annotated MADR template with every optional section.
- [adr-template-minimal.md](adr-template-minimal.md): compact MADR template for small but real decisions.
- [references/section-chooser.md](references/section-chooser.md): when to include each optional section.
- [references/patterns-and-anti-patterns.md](references/patterns-and-anti-patterns.md): ADR authoring/review patterns and failure modes.
- [references/worked-examples.md](references/worked-examples.md): minimal, full, bad-to-good, and superseding examples.
- [references/review-checklist.md](references/review-checklist.md): author and reviewer checks before accepting an ADR.
- [references/adr-log-conventions.md](references/adr-log-conventions.md): location, numbering, categories, links, and lifecycle rules.

## Use And Avoid

Use an ADR when the decision:

- Has architectural significance: structure, key qualities, major dependency, external interface, operating model, security posture, or cost/risk profile.
- Has real alternatives or meaningful tradeoffs.
- Will matter to future maintainers, reviewers, auditors, or adjacent teams.
- Needs agreement, implementation follow-through, or later revisiting.

Do not create an ADR for:

- Trivial implementation choices that are local, obvious, and cheap to reverse.
- A broad design document, RFC, policy, or architecture blueprint. Link those from the ADR instead.
- A decision already recorded clearly elsewhere, unless the user is asking to convert that record into the project's ADR log.
- A bundle of unrelated decisions. Split them.

## Workflow

### 1. Classify The Task

Decide which flow applies:

- **New ADR**: draft and write a decision record.
- **Review ADR**: critique a draft or existing ADR for completeness, rationale, and MADR fit.
- **Backfill ADR**: document a past decision honestly, including what is known now versus what was known then.
- **Supersede ADR**: write a new ADR and update the old ADR status.
- **Log setup**: choose ADR directory, numbering, categories, and templates.

### 2. Check Significance And Scope

State the decision as one question. If the question actually contains multiple choices, split it before drafting.

Gather:

- Problem and context.
- Decision drivers: requirements, constraints, qualities, risks, stakeholders.
- Real options, including status quo only when it is a viable option.
- Decision-makers, consulted experts, and informed stakeholders.
- Evidence: tickets, RFCs, benchmarks, incidents, PRs, diagrams, production constraints.

### 3. Discover Local Convention

Use [../../shared/plan-location-discovery.md](../../shared/plan-location-discovery.md) to find the right documentation area. Also inspect these ADR-specific locations:

- `docs/decisions/`
- `docs/adr/`
- `docs/ADRs/`
- `docs/architecture/decisions/`
- `decisions/`

If existing ADRs or templates exist, preserve their directory, filename, heading, status, and metadata conventions unless the user explicitly asks to migrate them. If no convention exists, use `docs/decisions/` and `NNNN-title-with-dashes.md`.

### 4. Choose ADR Size

Load [references/section-chooser.md](references/section-chooser.md) when deciding section depth.

- **Minimal**: use [adr-template-minimal.md](adr-template-minimal.md) for low-complexity decisions with clear options.
- **Standard**: include metadata, drivers, consequences, and more information for normal engineering decisions.
- **Full**: use [adr-template.md](adr-template.md) when the decision is controversial, high risk, multi-stakeholder, compliance-relevant, or likely to be revisited.
- **Experimental/time-boxed**: include confirmation, success/kill criteria, fallback plan, and review date.

### 5. Draft Or Review

For a new ADR:

1. Determine the next number by listing existing ADRs and matching the existing padding. Default to four digits.
2. Copy the selected template.
3. Fill required sections before optional sections.
4. Use exact option names consistently in `Considered Options`, `Decision Outcome`, and `Pros and Cons`.
5. Link supporting evidence instead of embedding large design detail.

For a review:

1. Load [references/review-checklist.md](references/review-checklist.md).
2. Separate template-conformance findings from decision-quality findings.
3. Prioritize actionable issues over copy edits.
4. Point to concrete missing content or unclear rationale.

For a superseding ADR:

1. Create a new ADR that explains why the earlier decision no longer holds.
2. Update the old ADR status to `superseded by ADR-NNNN`.
3. Link both directions through status or `More Information`.

### 6. Validate Before Finishing

Before returning the ADR or review, check:

- The ADR records one decision.
- The problem is relevant enough to record.
- All placeholders are removed or intentionally left as template guidance.
- The chosen option appears in the considered options.
- Options are real, comparable, and at the same abstraction level.
- Rationale ties back to drivers, constraints, or evidence.
- Consequences include at least one meaningful cost, risk, or tradeoff when the decision is accepted.
- Confirmation or revisit criteria exist for risky, experimental, compliance, or time-sensitive decisions.
- Cross-links, filenames, status values, and old superseded ADRs are consistent.

## Statuses

| Status | Meaning |
|--------|---------|
| proposed | Decision is under discussion, not yet agreed upon |
| accepted | Decision has been agreed upon and should be followed |
| rejected | Decision was considered but not adopted |
| deprecated | Decision is no longer relevant or recommended |
| superseded by ADR-NNNN | Replaced by a newer decision; link to the successor ADR |

Use the local project's status vocabulary if it already exists.

## Output Contract

When creating or updating an ADR, report:

- File path.
- Status and chosen option.
- Sections included and intentionally omitted.
- Validation performed.
- Open questions or follow-up actions.

When reviewing an ADR, report findings first by severity, with concrete fixes. Then list what is already sound.

## Common Mistakes

- Writing the ADR after implementation as a foregone conclusion instead of honest rationale.
- Comparing fake alternatives, mismatched abstraction levels, or one option only.
- Stating the choice without explaining why it satisfies the drivers.
- Hiding negative consequences or operational costs.
- Using subjective, promotional, or blame-oriented language.
- Turning the ADR into a full design document instead of linking supporting artifacts.
- Forgetting consulted/informed stakeholders, confirmation, or revisit criteria for decisions that need them.
