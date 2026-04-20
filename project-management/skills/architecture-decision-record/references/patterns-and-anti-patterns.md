# ADR Patterns And Anti-Patterns

Use this when drafting, reviewing, or repairing ADR quality.

## Contents

* [Authoring Patterns](#authoring-patterns)
* [MADR Style Patterns](#madr-style-patterns)
* [Creation Anti-Patterns](#creation-anti-patterns)
* [Review Patterns](#review-patterns)
* [Review Anti-Patterns](#review-anti-patterns)
* [Repair Moves](#repair-moves)

## Authoring Patterns

### One Decision

Record one significant decision per ADR. Split if the title needs "and", if options differ by subsystem, or if one decision can change independently from another.

### Decision Question

Frame the context as a question the decision outcome answers.

Good:

* "Which persistence model should the billing service use for idempotency keys?"

Weak:

* "Storage considerations."

### Real Options

List options that could plausibly solve the problem in the stated context. Include status quo or "do nothing" only when it is actually viable.

### Comparable Options

Keep options at the same abstraction level. Compare product to product, pattern to pattern, or implementation approach to implementation approach.

### Drivers Before Preference

Name the criteria before arguing for the result. Useful drivers include reliability, latency, cost, security, migration effort, operational burden, reversibility, team skill, compliance, and time to deliver.

### Balanced Consequences

Include both benefits and costs. An accepted decision without negative consequences is usually incomplete, not perfect.

### Evidence Links

Link supporting artifacts instead of embedding large context. Good evidence includes tickets, incident reviews, PRs, RFCs, benchmarks, spike notes, diagrams, threat models, and production dashboards.

### Confidence And Revisit

State confidence, assumptions, review date, success criteria, or kill criteria when the decision depends on uncertain requirements or experimental evidence.

### Actionable Confirmation

Describe how the team will know the decision was implemented. Confirmation can be manual or automated, but it must be concrete enough to check.

### Supersede Instead Of Rewriting History

Accepted ADRs are historical records. When reality changes, create a new ADR and mark the old one as superseded or deprecated.

## MADR Style Patterns

* Use `NNNN-title-with-dashes.md` unless the repository already has another convention.
* Use the title without the ADR number as the H1.
* Use `*` for unordered lists to match MADR style.
* Use `{curly braces}` for placeholders in templates.
* Repeat option names instead of inventing short identifiers.
* Put `Decision Outcome` before detailed option pros and cons.
* Use `Good, because ...`, `Bad, because ...`, and `Neutral, because ...` consistently.
* Put related ADR links in `More Information` unless local tooling requires another format.

## Creation Anti-Patterns

### Fairy Tale

Symptom: The rationale is shallow, tautological, or only positive.

Repair: Replace slogans with drivers, evidence, and tradeoffs.

### Sales Pitch

Symptom: The ADR uses promotional adjectives, vendor hype, or unverifiable claims.

Repair: Delete adjectives that do not change technical meaning. Link evidence for claims that remain.

### Free Lunch Coupon

Symptom: Consequences are absent or only harmless.

Repair: Add implementation, operational, maintenance, migration, cost, security, and long-term risks.

### Dummy Alternative

Symptom: One option is fake, impossible, or included only to make the preferred choice look good.

Repair: Replace it with a real option or state that only one feasible option exists and why.

### Sprint

Symptom: Only short-term effects are discussed for a long-lived decision.

Repair: Add medium- and long-term consequences, revisit criteria, or staged decisions.

### Tunnel Vision

Symptom: The ADR only considers one local stakeholder or lifecycle phase.

Repair: Add consequences for operators, maintainers, users, adjacent teams, and security/compliance when relevant.

### Maze

Symptom: The title, context, options, and outcome do not discuss the same decision.

Repair: Refocus around one decision question. Move tangential material to `More Information` or a linked design document.

### Blueprint Or Policy In Disguise

Symptom: The ADR reads like a full design spec, runbook, or law.

Repair: Keep the decision summary and rationale in the ADR. Link the detailed design, policy, or runbook.

### Mega-ADR

Symptom: One ADR contains many pages, many diagrams, or several independent decisions.

Repair: Split decisions. Move detailed architecture description to a supporting artifact.

### Novel

Symptom: The ADR is an extended narrative with casual tone and weak decision structure.

Repair: Rewrite around context, options, outcome, consequences, and confirmation.

### False Urgency

Symptom: Context invents or exaggerates a problem to force a decision.

Repair: Make the actual requirement, incident, risk, or stakeholder concern explicit.

### Solution Seeking Problem

Symptom: The ADR exists to justify a predetermined tool or pattern.

Repair: Rebuild from the problem and drivers. If the decision was already made, write a backfill ADR honestly.

### Pseudo-Accuracy

Symptom: Weighted scoring or math creates a false sense of objectivity.

Repair: Use qualitative drivers, clear priorities, evidence, and explicit tradeoffs.

## Review Patterns

### Scope The Review

State whether the review is for template conformance, decision quality, stakeholder approval, or final readiness.

### Content Before Copy Edits

Check the decision question, options, drivers, rationale, and consequences before grammar and formatting.

### Finding And Fix

Make comments resolvable. Pair every issue with a concrete suggested fix or example.

### Context-Aware Challenge

Challenge weak rationale, missing options, and hidden risks while respecting the requirements and information available when the decision was made.

## Review Anti-Patterns

### Pass Through

The review skims the ADR and leaves no useful comments.

### Over-Friendliness

The review gives only shallow praise and does not improve decision quality.

### Copy Edit

The review focuses only on wording and misses content issues.

### Siding Or Dead End

The review derails into unrelated topics or stops without actionable advice.

### Self Promotion

The reviewer pushes their preferred solution without objective context-specific arguments.

### Power Game

The reviewer relies on hierarchy, experience, or influence instead of technical arguments.

### Offended Reaction

The reviewer defends a criticized option subjectively instead of evaluating the ADR.

### Repetition

The review repeats the same point without adding new evidence or a concrete path to resolution.

## Repair Moves

* Split one ADR into several single-decision ADRs.
* Add missing real options.
* Replace fake alternatives.
* Move design detail to a linked artifact.
* Add drivers and tie outcome to them.
* Add good, bad, and neutral consequences.
* Add confirmation checks or revisit criteria.
* Link evidence instead of embedding it.
* Mark superseded ADRs and add reciprocal links.
