# Meeting Summarizer — Usage Guide

Turn a raw meeting transcript (Gemini, Granola, Otter, Fireflies, Zoom, pasted text, …) into a precise structured summary. The skill's defining feature is that it **refuses to inflate discussions into decisions**: a "Decision" in the output was genuinely decided, not merely discussed.

## Invoking the skill

Trigger the skill by asking in natural language — no slash command required. Examples:

- "Summarize this transcript: …"
- "Here's the Gemini notes for yesterday's sync, give me a structured summary"
- "Turn this meeting recording transcript into minutes and save it in the project"
- "What was decided in this meeting?" *(with the transcript attached)*

The skill's trigger fires on any of those phrasings. It will **not** fire for design docs, chat logs, email threads, or behavioral-analysis requests — those are explicitly out of scope.

## Two modes

### Chat mode (zero setup)

Paste a transcript into the conversation and ask for a summary. The skill prints the summary inline. Use this for one-offs, personal notes, or when you're not in a project context.

### File mode (with project setup)

The skill writes the summary to a meeting-summaries directory in your project, following your project's naming convention. Use this for recurring client meetings, team standups, or anywhere you want a durable log.

## Setting up File mode

### 1. Create a meeting-summaries directory

The skill looks for (in priority order):

- `meeting-summaries/`
- `meetings/`
- `notes/meetings/`
- `docs/meetings/`
- any directory whose name contains `meeting` or `summaries`

### 2. Declare a naming convention (recommended)

Add a `README.md` inside that directory stating the filename pattern. Example:

```markdown
# Meetings

Weekly team meeting summaries. Each file is named `YYYY-MM-DD.md`.

## Index

| Date | Title |
|------|-------|
| [2026-04-17](2026-04-17.md) | Session Storage Sync |
```

If no README is present, the skill infers the convention from existing filenames. If the directory is empty, it defaults to `YYYY-MM-DD.md`.

### 3. Add a glossary (optional, but strongly recommended)

If your project has domain-specific terms that transcription tools mangle (acronyms, product names, casing), add a glossary file. The skill rewrites mangled terms to the canonical form.

The skill looks for (in priority order):

1. A dedicated file: `glossary.md`, `GLOSSARY.md`, `terminology.md`, `TERMINOLOGY.md`, `docs/glossary.md`, `docs/terminology.md`
2. A `Glossary` or `Terminology` heading inside `CLAUDE.md`, `AGENTS.md`, or `README.md`

**Example glossary entry:**

```markdown
# Glossary

| Term | Definition |
|------|------------|
| **Broker** | The message broker service that routes events between producers and consumers. Named component, always capitalized. |
| **dApp** | Decentralised application. |
```

With this glossary, the skill will rewrite `broker` → `Broker` and `DAPs` → `dApps` when those words refer to the components as standalone nouns. Attributive uses (e.g. `broker config file`) stay lowercase.

## What happens when you invoke it

1. The skill reads the full transcript before drafting anything
2. It classifies every substantive item into one of four buckets: **Decision**, **Action Item**, **Discussion**, **Open Question**. When in doubt, it picks the weakest bucket (Discussion, not Decision)
3. Pleasantries, timestamps, AI-generated footers, tangents, and meeting-logistics tasks ("share the recording") are stripped
4. The draft is self-audited against red flags (e.g., a Decision without a transcript confirmation phrase is demoted)
5. In File mode: the skill discovers the output directory, checks for a filename collision, runs the terminology pass against the glossary, and **announces the chosen path + any terminology corrections and waits for your confirmation** before writing
6. On confirmation: the file is written and the path is reported

## Output shape

Every summary follows the same structure. Empty sections are omitted.

```markdown
# YYYY-MM-DD — {Short Meeting Title}

**Attendees:** {Names only, comma-separated}

## Decisions
- **{Topic}**: {what was decided} — {rationale from the transcript, if stated}

## Action Items
- [ ] **{Owner}** — {what they need to do} {(by {deadline}), if stated}

## Discussion Points
### {Topic}
- {key point}

## Open Questions
- {unresolved question} — {why deferred, if stated}

## Disagreements
- **{Topic}**: {position A} vs. {position B} — unresolved
```

## Handling same-day meetings

If two different meetings fall on the same date, the default `YYYY-MM-DD.md` filename collides. The skill handles this by comparing titles:

- **Same title** (re-run on the same transcript) → offers overwrite
- **Different titles** (different meetings) → offers the two-slug path: save the new summary as `YYYY-MM-DD-<new-slug>.md` AND rename the existing file to `YYYY-MM-DD-<existing-slug>.md` so both files share the same shape

You always get the final say before any write or rename. If the directory's README has an index, the skill reminds you to update it after a rename (the skill does not edit the README itself).

## Worked example

**Transcript (paste into chat):**

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

**Output:**

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

Note what is **not** in the output: the "yeah, makes sense" pleasantry, the timestamps, and any invented rationale. The rationale ("lower latency, already running in production") is present because Ana stated it verbatim.

## What the skill will refuse to do

- **Invent decisions**: if the transcript does not contain an explicit confirmation phrase, the item is Discussion, not Decision
- **Invent owners or deadlines**: if no owner is named, the owner is `**TBD**` or the item becomes an Open Question; deadlines are omitted if not stated
- **Invent document/ADR/ticket references**: only artifacts actually named in the transcript appear in the summary
- **Include meeting-logistics tasks as Action Items**: "share the recording", "send the transcript", "schedule the follow-up" are noise and get dropped; the Action Items section is omitted entirely if no project-work commitments exist
- **Silently overwrite**: every file write is announced first and waits for your confirmation

## FAQ

**Can I override the chosen filename?**
Yes. After the skill announces the path, tell it where you want the file instead.

**Can I skip the glossary pass?**
In Chat mode the pass is already skipped. In File mode, if no glossary exists, the pass is also skipped automatically.

**The skill capitalized a word I wanted lowercase.**
The terminology pass only rewrites casing when the word refers to a component as a standalone noun; attributive uses (e.g. `gateway API key`) stay lowercase. If you disagree with a correction, tell the skill to revert it before it writes.

**What if the transcript is ambiguous about whether something was decided?**
The skill picks the weakest bucket it can defend (Discussion over Decision, Open Question over Action Item). That is the skill's design intent, not a bug.

**Can I use this for meetings that don't have a date?**
The `YYYY-MM-DD` prefix assumes the transcript carries a date (most auto-generated notes do). If no date is present, tell the skill the meeting date explicitly.
