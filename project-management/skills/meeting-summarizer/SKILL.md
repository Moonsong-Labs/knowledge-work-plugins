---
name: meeting-summarizer
description: "Use when converting a meeting transcript, recording transcript, or auto-generated notes (Gemini, Granola, Otter, Fireflies, Zoom) into a structured summary. Not for behavioral analysis, filler-word counts, or facilitation critique."
---

# Meeting Summarizer

## Overview

Convert a raw meeting transcript into a structured summary that preserves precision.

The default failure mode when summarizing a meeting is **inflation**: "we discussed X" becomes "we decided X", a passing suggestion becomes an action item, a speculative remark becomes consensus. This skill enforces the opposite discipline so readers of the summary can trust that a "Decision" really was decided.

**Core principle: Fidelity over comprehensiveness.** A short accurate summary beats a long confident-sounding one that invents agreement.

The [meeting summary template](meeting-summary-template.md) contains the exact output shape.

**Announce at start:** "I'm using the meeting-summarizer skill to produce a precise, structured summary."

## When to Use

- User provides a meeting transcript, call recording transcript, or auto-generated meeting notes and asks for a summary, minutes, or structured notes
- User asks "what was decided" or "what are the action items" from a meeting
- Input contains speaker lines, timestamps, or auto-generated metadata from a transcription tool

## When NOT to Use

- User wants behavioral analysis, speaking ratios, facilitation critique, or filler-word counts (this skill is about content, not communication style)
- Input is a design doc, chat log, email thread, or other non-meeting content
- User wants a verbatim cleanup of the transcript without classification

## Content Rules

Rules about what the summary must contain. Apply these during drafting and self-audit, before the operational steps in the next section.

### The Core Discipline: Classify, Don't Synthesize

Every substantive item in the transcript goes into exactly one of four buckets. **Pick the weakest bucket you can defend from the transcript.** When in doubt, it is Discussion, not Decision.

| Transcript signal | Classify as | Do NOT classify as |
|-------------------|-------------|--------------------|
| Explicit confirmation ("OK, let's go with X", "We'll do X", "Agreed, X it is"), or an owner accepts a concrete plan | Decision | Discussion |
| Named owner + concrete task ("Alice, can you update the doc by Friday?" → "Yes") | Action Item | Decision |
| Topic was weighed with pros/cons or options but no one locked it in | Discussion | Decision |
| "Let's figure that out later", "We'll discuss next week", or the topic trails off | Open Question | Decision / Discussion |
| Two or more participants held opposing positions and neither yielded | Open Question (with positions noted) | Decision |
| Pleasantries, "can you hear me", "sounds good", "let me check my calendar", tangents | Omit | Anything |

#### Evidence rules

Before writing a Decision or Action Item, verify from the transcript:

- **Decision:** Is there an explicit confirmation phrase, or does the conversation move on as if the matter is closed with a named choice? If only one person proposed it and the group did not visibly accept it, it is a Discussion, not a Decision.
- **Action Item:** Is there a **named owner** (a specific person, not "the team") AND a **concrete task**? If the owner is implicit or the task is vague ("someone should look into it"), either name the owner as `TBD` or demote to an Open Question. Never invent an owner.
- **Rationale on a Decision:** Only include a rationale if the transcript states one. Do not invent "because it's simpler" or "for performance reasons" unless those words or equivalents appear in the transcript.

#### Action Items must deliver project value

An Action Item exists to help a reader *do project work*. Meeting-logistics tasks (share the recording, send the transcript, schedule the follow-up, add to next week's agenda, circulate the invite) are noise — **omit them**, even when they have a named owner and a concrete verb.

Test: does the **object** of the action refer to the meeting itself, or to a project artifact?

| Action | Object type | Keep? |
|--------|-------------|-------|
| "I'll chunk the recording and send it" | Meeting artifact (recording) | Omit |
| "I'll share the transcript" | Meeting artifact (transcript) | Omit |
| "I'll put this on Thursday's agenda" | Meeting artifact (agenda) | Omit |
| "I'll send the calendar invite" | Meeting artifact (invite) | Omit |
| "I'll update the policy ADR" | Project artifact (ADR) | Keep |
| "I'll share the Gateway component diagram" | Project artifact (existing diagram) | Keep |
| "I'll write up the schema design" | Project artifact (design doc) | Keep |
| "I'll investigate the materialized-view path" | Project investigation | Keep |
| "I'll confirm with Alice whether we can use X" | Unblocking decision | Keep |

If the only "action items" you can find are meeting-logistics tasks, the Action Items section has no content — omit the entire section.

#### Hedge language preserves uncertainty

When something was merely proposed or favored by one participant, keep that attribution in Discussion. Examples:

- Transcript: "Ana: I lean towards Redis for this." → Discussion bullet: `Ana favored Redis over DynamoDB for session storage.` **Not** a Decision.
- Transcript: "Maybe we could switch to gRPC." → Discussion bullet: `gRPC was raised as a possible alternative.` **Not** an Action Item.

#### Combine tightly coupled decisions

When two decisions are tightly coupled — one is the mechanism, rationale, or condition for the other — combine them into a single bullet rather than emitting two. Use a secondary clause (`... preserved via ...`, `... pending ...`, `... with ...`) to carry the coupled piece.

Example:

- **Session storage**: Redis is the session store over DynamoDB — lower latency; durability preserved via hourly snapshots to S3

Do not split this into two bullets. The snapshot mechanism is not a parallel decision; it addresses the durability concern raised during the storage decision.

This rule only applies when one decision is genuinely the mechanism/rationale/condition of the other. Unrelated decisions stay in separate bullets.

#### Open Questions include implicit deferrals

Agents often miss open questions buried in flowing discussion. Scan the transcript for these phrases and paraphrases, and treat each as an Open Question candidate:

- "we haven't decided yet"
- "we still need to figure out"
- "to be determined" *(spoken — distinct from the `**TBD**` token used in Action Items for missing owners)*
- "we'll decide later" / "we'll see"
- "either X or Y"
- "for now ... but we might ..."
- "let's take that offline" / "let's defer that"

An item becomes an Open Question if the transcript does not also contain a resolution elsewhere. Explicit parking ("let's discuss next week") is not required.

#### Topic grouping in Discussion Points

Use H3 subheadings to group related points. "One topic per heading" does not mean "one bullet per heading". A single coherent thread that covers several related subtopics stays under one heading. Create a new heading only when the subject matter changes to a genuinely different technical domain (e.g. auth vs. consensus, request flow vs. deployment).

Rule of thumb: if two subtopics share stakeholders, mechanisms, or constraints, they belong under the same heading.

#### Preserve stated constraints

When the transcript contains a specific constraint or qualifier ("only X", "not via Y", "infrequent so Z is tolerable", "at the scale already required"), preserve it in the summary. These constraints carry the highest-value information in a discussion; dropping them in favor of a generic paraphrase erases what made the discussion informative.

Rule of thumb: if the sentence survives as accurate when the constraint is removed, keep the constraint anyway.

### Output Contract

The **summary content** contains no preamble, no "Here is the summary", no trailing commentary. The first character of the summary is `#`, the last character is the final character of the summary.

This applies whether the summary is printed to chat or written to a file. Conversational text around the summary (announcing the chosen path, asking for overwrite confirmation, reporting that the file was written) is separate from the summary content and does not violate the no-preamble rule.

Follow the structure in [meeting-summary-template.md](meeting-summary-template.md). If a section has no content, omit the entire section (heading and all). Never emit an empty section.

### Specific Rules

1. **Start with `#` as the first character.** No preamble.
2. **Present tense for Decisions.** "Sessions use Redis" — not "We decided sessions would use Redis".
3. **Past/descriptive tense for Discussion Points and Open Questions.**
4. **Strip all timestamps** (`0:00`, `01:15:22`, `[00:04:12]`, etc.).
5. **Strip AI-generated footers and disclaimers** (e.g., "This meeting summary was generated by Google Gemini", "Generated by Otter.ai").
6. **Strip pleasantries and logistical chatter** ("can you hear me", "sounds good", "let me grab water", "I have a hard stop at 4").
7. **Names only in Attendees.** No emails, titles, or company suffixes. Use the name as spoken.
8. **Never fabricate.** If the transcript does not state an owner, a rationale, a deadline, or a reference, do not invent one. Use `TBD` for missing owners; omit the field entirely for missing rationales or deadlines.
9. **Reference existing artifacts only if named.** Do not invent ADR numbers, doc titles, or ticket IDs that are not in the transcript.
10. **Keep the summary tight.** Target under 600 words for a 1-hour meeting. Longer summaries correlate with invention.
11. **Meeting title** is a short, descriptive phrase derived from what was actually discussed or decided. Use the explicit calendar name (e.g. "Weekly Tech Standup") **only when the meeting covers so many unrelated topics that no specific theme emerges**. Prefer a content-based title every other time. Good: `Session Storage Sync`. Avoid: `Weekly Tech Standup`.

### Rationalizations to Reject

| Thought | Reality |
|---------|---------|
| "Everyone nodded along so it's a Decision" | Nodding is not in the transcript. Without an explicit confirmation, it is Discussion. |
| "The context makes it obvious this is what they decided" | If it is obvious, the transcript will say so. If the transcript does not say so, it is Discussion or Open Question. |
| "The rationale is implied — I'll just state it" | Implied rationales are invention. Omit the rationale rather than fabricate one. |
| "Alice probably owns this follow-up" | "Probably" is not ownership. Use `TBD` or demote to Open Question. |
| "This suggestion is clearly going to happen" | Suggestions are Discussion. Only named-owner + concrete-task becomes Action Item. |
| "I should include this tangent for completeness" | Tangents are noise. Omit. |
| "The summary feels too short" | Short and accurate beats long and inflated. Do not pad. |
| "The meeting mentions an ADR-042 style reference I'll flesh out" | If the transcript does not name the doc/ADR, do not invent one. |
| "Someone committed to share the recording — that's an Action Item" | Meeting-logistics tasks (recording, transcript, agenda, invite) are not project work. Omit. |
| "They didn't explicitly park this, so it's not an Open Question" | Implicit deferrals ("we haven't decided", "for now ... but we might", "either X or Y") are Open Questions too. |
| "The calendar invite is called X, so the title should be X" | Prefer a content-based title derived from what was discussed. Use the calendar name only when no theme emerges. |
| "These two decisions are related, so list them both" | If one is the mechanism/rationale of the other, combine into a single bullet. |
| "The speaker said it more specifically but I'll paraphrase to be concise" | If a stated constraint ("only X", "not via Y") survives being removed, keep it anyway. Specifics are the highest-value compression. |

### Red Flags — Stop Before Writing

- You are about to write a Decision but cannot quote or paraphrase the confirmation phrase from the transcript
- You are about to assign an owner whose name appears in the transcript but who did not verbally accept the task
- You are about to write a rationale that starts with "for performance" / "for simplicity" / "because it's cleaner" without that reasoning being in the transcript
- Your Decisions section is longer than the Discussion Points section (decisions are usually the smaller subset)
- You find yourself writing "the team agreed" or "everyone was aligned" without a transcript line that confirms alignment
- The Action Item's object is the meeting itself (recording, transcript, agenda, invite) rather than a project artifact — drop it
- The meeting title is the calendar invite name but the discussion had a clear specific theme — rewrite to the content-based title
- Attendees list includes names that never appeared as a speaker line — drop them
- Two decision bullets are actually the same decision with one being the mechanism of the other — merge them
- A specific constraint from the transcript ("only X", "not via Y") was paraphrased away into a generic statement — restore the constraint

If any of these fires, move the item one bucket weaker (Decision → Discussion, Action Item → Open Question) or omit it.

### Common Mistakes

| Mistake | Correct behavior |
|---------|------------------|
| Starting with "Here is the summary" | First character is `#` |
| Including emails in Attendees | Names only |
| Keeping `0:15 -` style timestamps | Strip all timestamps |
| Using past tense for Decisions ("We decided...") | Present tense ("Sessions use Redis") |
| Inventing rationale not in the transcript | Omit the rationale |
| Inventing owner for an Action Item | Use `**TBD**` or move to Open Questions |
| Inventing ADR / doc / ticket references | Only cite artifacts named in the transcript |
| Including the transcription tool's AI disclaimer | Omit entirely |
| Adding sections not in the template ("Summary", "Overview", "Key Takeaways") | Use only the template sections |
| Narrative prose in Discussion Points | Concise bullet points, one fact each |
| Inflating a single participant's suggestion into a team Decision | Keep it in Discussion with attribution |
| Listing invited participants who never spoke as Attendees | Attendees are speakers only; silent invitees add no information |
| Using the calendar invite name as the title when the meeting had a specific theme | Use a content-derived title; reserve the calendar name for grab-bag agendas |
| Splitting a decision and its mechanism into two bullets | Combine: `**Topic**: choice — rationale; mechanism preserved via ...` |
| Over-splitting a single architecture walkthrough into many H3 headings | One heading covers a coherent thread; split only for genuinely different technical domains |
| Paraphrasing specific transcript constraints ("not via Y", "only X") into generic statements | Preserve stated constraints verbatim; they are the highest-value compression |
| Listing "share the recording / send the transcript / schedule a follow-up" as Action Items | Drop meeting-logistics tasks; Action Items are for project work only |
| Keeping transcription-mangled terms (`DAPs` instead of `dApps`, decentralised applications) when a project glossary defines the canonical form | Run the terminology pass in File Mode; rewrite to the glossary spelling and report the corrections |
| Guessing a canonical spelling for a term that is not in the glossary | Leave the transcript form. Do not invent canonical terms. |

### Example

**Input (excerpt):**

```
0:40 - Ana: The two options are Redis or DynamoDB for session storage.
I lean toward Redis — lower latency, and we already run it in prod.

1:10 - Ben: Yeah, that makes sense to me too.

2:15 - Carla: OK so we're going with Redis for sessions. Ana, can you
update the ADR?

2:22 - Ana: Will do, by end of week.

3:01 - Carla: One thing we didn't settle — how do we handle failover?
Let's take that offline.
```

**Expected output:**

```markdown
# 2026-04-17 — Session Storage Sync

**Attendees:** Ana, Ben, Carla

## Decisions

- **Session storage**: Redis is the session store over DynamoDB — lower latency, already running in production

## Action Items

- [ ] **Ana** — Update the session storage ADR to reflect the Redis choice (by end of week)

## Open Questions

- How to handle Redis failover for session storage — deferred, to be taken offline
```

Note what is **not** in the output: the "yeah, makes sense" pleasantry, timestamps, and any invented rationale. The rationale ("lower latency, already running in production") appears because Ana stated it verbatim.

## Operational Flow

Rules about how the skill runs in a project — where the file lands, how terminology is validated, the end-to-end step ordering.

### Output Destination

Before writing the summary, decide where it goes. There are two modes:

- **File mode** — write to a meeting-summaries directory in the current project
- **Chat mode** — print inline in the conversation

#### Discovery

1. Scan the current project (CWD and up to two levels deep) for a meetings directory. Priority order:
   - `meeting-summaries/`
   - `meetings/`
   - `notes/meetings/`
   - `docs/meetings/`
   - Any directory whose name contains `meeting` or `summaries`
2. If a directory is found, check for a convention:
   - Read any `README.md` inside it for an explicit naming rule
   - Otherwise, list existing `*.md` files and adopt the dominant pattern (e.g., `YYYY-MM-DD.md`, `YYYY-MM-DD-<topic>.md`)
   - If the directory is empty or no pattern is clear, default to `YYYY-MM-DD.md`
3. If no directory is found, ask the user: "No meeting-summaries directory found. Where should I save this, or do you want me to just print it to chat?"

#### Collision check

Before writing, test whether the target file exists. If it does, do NOT overwrite silently.

1. Read the existing file's first line — the `# YYYY-MM-DD — <Title>` heading.
2. Compare the existing title to the new summary's title:
   - **Same title** → this is a re-run on the same meeting. Offer overwrite as the default.
   - **Different title** → two different meetings fell on the same day. Default to the two-slug path below.

**Two-slug path (different meetings, same day):**

- Save new summary as `YYYY-MM-DD-<new-slug>.md`
- Also rename the existing `YYYY-MM-DD.md` → `YYYY-MM-DD-<existing-slug>.md` so both files share the same shape
- `<slug>` is a short kebab-case derivative of the meeting title (e.g. *Session Storage Sync* → `session-storage-sync`)
- Ask the user to confirm both actions before writing or renaming
- If the directory has a `README.md` with an index table that links to the renamed file, remind the user to update the index — the skill does not edit the README

**Other options (always offered):**

- Save new summary with a slug, leave the existing file unchanged
- Overwrite (only if this really is the same meeting)
- Abort and print to chat instead

Example prompt for the different-meetings case:

> "Existing `2026-04-16.md` is titled *Architecture Review*. New summary is titled *Session Storage Sync*. Options:
> - Save new as `2026-04-16-session-storage-sync.md` AND rename existing to `2026-04-16-architecture-review.md` (recommended, keeps naming consistent)
> - Save new as `2026-04-16-session-storage-sync.md` only, leave existing unchanged
> - Overwrite (only if this is the same meeting)"

#### Announce and wait

Announce the chosen path (with reasoning) and wait for confirmation. Do not write the file before the user confirms. Example:

> "`meeting-summaries/` already uses the `YYYY-MM-DD.md` naming from its README. I'll save this to `meeting-summaries/2026-04-16.md`. OK?"

Only after confirmation: write the file. Report the written path once done.

#### When to default to chat mode

- The user pasted the transcript directly into chat with no project context
- No meetings directory exists and the user does not want to create one
- The user explicitly asks for the summary inline

### Terminology Validation (File Mode only)

Transcription tools mangle project-specific terms. Examples: `dApps` (decentralised applications) transcribed as `DAPs`; a named component like `Gateway` typed as `gateway`. When the summary is being written into a project, cross-check domain terms against the project's glossary and rewrite to the canonical form (including case).

**Skip this pass entirely in Chat Mode**, and skip it in File Mode if no glossary is found. Do NOT invent canonical forms.

#### Glossary discovery

After drafting the summary, look for a glossary in this priority order:

1. Dedicated glossary file at project root or under `docs/`:
   - `glossary.md`, `GLOSSARY.md`
   - `terminology.md`, `TERMINOLOGY.md`
   - `docs/glossary.md`, `docs/glossary/`, `docs/terminology.md`
2. A "Glossary" or "Terminology" heading inside `CLAUDE.md`, `AGENTS.md`, or `README.md`

If nothing is found, skip the pass.

#### Validation rules

- For each domain-specific term in the drafted summary (acronyms, product names, component names, compound technical terms), check whether the glossary defines it
- Match on meaning, not just letters: if the transcript's term has a parenthetical expansion (`DAPs (decentralised applications)`) that matches a glossary entry with a different spelling (`dApps — decentralised applications`), rewrite to the canonical form
- **Casing is part of the canonical form.** If the glossary defines `Gateway` as a named component, rewrite lowercase `gateway` to `Gateway` — but only when the word refers to the component as a standalone noun. Do NOT capitalize when the word is used attributively as a modifier: `the Gateway forwards requests` gets corrected; `gateway API key` (where *gateway* modifies *API key*) stays lowercase
- If a term appears in the transcript but not in the glossary, **leave it as-is** — do not guess a canonical form
- If two glossary sources disagree, prefer the most project-specific one (dedicated file > CLAUDE.md/AGENTS.md heading), and surface the conflict to the user

#### Report before writing

List the corrections as part of the announce-and-wait step, so the user can veto before the file is written:

> "Applied glossary corrections: `DAPs` → `dApps` (decentralised applications). Writing to `meeting-summaries/2026-04-16.md`. OK?"

If no corrections were made, skip the corrections line.

### Workflow

1. **Read the full transcript once before writing anything.** You cannot classify correctly without knowing how a topic resolved later in the meeting.
2. **Extract Attendees from the set of speakers** in the transcript. Invited participants who never spoke are omitted — their attendance is not established and they add no information. Strip emails, titles, and company suffixes. Use the name as spoken.
3. **For each substantive topic, pick the weakest bucket you can defend.** Apply the evidence rules.
4. **Draft the summary** into the template structure. Omit empty sections.
5. **Self-audit against Red Flags** before finalizing. Demote or omit anything that fails.
6. **Check word count.** If longer than ~600 words for a 1-hour meeting, look for padding or inflation.
7. **Resolve the output destination.** Follow the Output Destination section: discover directory, check for naming convention, check for filename collision. If no directory is found and the user does not provide one, fall back to chat mode.
8. **Run the terminology pass** (File Mode only). Follow the Terminology Validation section: discover glossary, rewrite drafted terms to canonical forms, collect corrections. Skip if no glossary exists.
9. **Announce and wait.** Present the chosen path plus any terminology corrections, and wait for user confirmation before writing.
10. **Write or print.** After confirmation, write to the confirmed path and report the written path; otherwise print the summary inline.
