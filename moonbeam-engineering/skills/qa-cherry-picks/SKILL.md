---
name: qa-cherry-picks
description: QA cherry-pick tracking documents for polkadot-sdk fork upgrades. Use when auditing, verifying, or updating cherry-pick tables in docs/cherry-picks/, when upgrading to a new polkadot-sdk stable branch, or when checking if a cherry-pick was applied.
---

# QA Cherry-Picks

Moonbeam maintains forks of `polkadot-sdk`, `frontier`, `evm`, `ethereum`, and `moonkit`. Each fork has a `moonbeam-polkadot-stable<YYMM>` branch with cherry-picks on top of the upstream stable release. The cherry-pick tracking documents in `docs/cherry-picks/` record every cherry-pick and its status.

## Documents

Cherry-pick tracking documents live in `docs/cherry-picks/` inside the moonbeam repository and follow the naming convention `<repo>-stable<YYMM>.md`. For example:

- `docs/cherry-picks/polkadot-sdk-stable2512.md` — current stable branch
- `docs/cherry-picks/polkadot-sdk-stable2506.md` — previous stable branch

> **Note:** The filenames above are examples. Check the `docs/cherry-picks/` directory for the actual documents relevant to the current upgrade cycle.

## Table Schema

Each repo section has a markdown table with these columns:

| Column      | Description                                                                                                              |
|-------------|--------------------------------------------------------------------------------------------------------------------------|
| Applied     | `Yes`/`No` — was it applied on the previous stable branch?                                                               |
| Title       | Human-readable description of the change                                                                                 |
| Commit      | Link to the actual commit on the current `moonbeam-polkadot-stable<YYMM>` branch (empty if Dropped)                      |
| Cherry pick | `Included` (on current branch), `Dropped` (removed), `squash` (folded into another)                                      |
| Status      | Upstream status: `Permanent`, `Temporary`, `PR Upstream Merged`, `Upstream PR not merged`, `Needs PR upstream`, `Closed` |
| Upstream PR | Link to the upstream PR (if any)                                                                                         |
| Note        | Context, Jira tickets, related PRs                                                                                       |

## Activities

This skill coordinates several activities. Read the relevant resource when performing each task:

| Activity | Resource | Description |
|----------|----------|-------------|
| Verify cherry-picks | [./verify-cherry-picks.md](./verify-cherry-picks.md) | Confirm cherry-picks against a branch using `git merge-base` |
| Create new document | [./create-cherry-pick-document.md](./create-cherry-pick-document.md) | Build a tracking doc for a new stable branch upgrade |
| Common pitfalls | [./common-pitfalls.md](./common-pitfalls.md) | Known gotchas when working with cherry-pick tables |

## Sub-Agent Workflow

For verification and auditing tasks, dispatch a **cherry-pick specialist sub-agent per repo** so that each fork can be processed in parallel. Use [./cherry-pick-specialist-prompt.md](./cherry-pick-specialist-prompt.md) as the prompt template.

### Process

1. Read the tracking document to identify which repos have cherry-pick tables.
2. For each repo, dispatch a sub-agent using [./cherry-pick-specialist-prompt.md](./cherry-pick-specialist-prompt.md), filling in:
   - The repo name and tracking document path
   - The fork branch and upstream remote/ref from [./verify-cherry-picks.md](./verify-cherry-picks.md)
3. Collect sub-agent reports and aggregate discrepancies.
4. Review flagged issues and update the tracking document as needed.

### Why Sub-Agents

- **Parallel execution** — each repo is independent; sub-agents can run concurrently.
- **Fresh context** — each sub-agent focuses on a single repo without cross-contamination.
- **Focused expertise** — the specialist prompt encodes the verification steps and pitfalls.
