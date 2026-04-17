<!-- Template: output contract for the meeting-summarizer skill. -->
<!-- Use these sections in this order. Omit any section that has no content. -->
<!-- Never emit an empty heading. Never add sections not in this template. -->

# YYYY-MM-DD — {Short Meeting Title}

**Attendees:** {Speakers only — names comma-separated. Drop silent invitees, emails, roles, and company suffixes.}

## Decisions

<!-- Only items with an explicit confirmation in the transcript. -->
<!-- Format: - **{Topic}**: {what was decided} — {rationale, only if stated} -->
<!-- Present tense. Omit the "— rationale" clause if the transcript did not state one. -->
<!-- Combine tightly coupled decisions (one is the mechanism/rationale of the other) into a single bullet. -->

- **{Topic}**: {what was decided} — {rationale from the transcript}

## Action Items

<!-- Only items with a named owner AND a concrete task. -->
<!-- Use **TBD** if no owner was assigned. Never invent an owner. -->
<!-- Include a deadline only if stated. -->

- [ ] **{Owner}** — {what they need to do} {(by {deadline}), if stated}

## Discussion Points

<!-- Substantive topics that were discussed but not decided. -->
<!-- H3 groups related points; one heading can cover several related subtopics. -->
<!-- Split into a new heading only for a genuinely different technical domain. -->
<!-- Concise bullets, one fact per bullet. Preserve stated constraints verbatim. -->
<!-- Attribute positions to speakers when it matters ("Ana favored X"). -->
<!-- Omit tangents, pleasantries, and logistical chatter. -->

### {Topic}

- {key point, factual and attributed if relevant}
- {key point}

### {Topic}

- {key point}

## Open Questions

<!-- Unresolved items, anything explicitly deferred, and anything implicitly left open. -->
<!-- Implicit signals: "we haven't decided yet", "we still need to figure out", -->
<!-- "either X or Y, we'll see", "for now ... but we might ...". -->
<!-- Format: - {question or topic} — {why deferred, if stated} -->

- {question or topic} — {reason for deferral, if stated}

## Disagreements

<!-- Only if participants held opposing positions and neither yielded. -->
<!-- Omit this section entirely if there were none. -->

- **{Topic}**: {position A, attributed} vs. {position B, attributed} — unresolved
