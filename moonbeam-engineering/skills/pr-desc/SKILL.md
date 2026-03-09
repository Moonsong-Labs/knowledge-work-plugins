---
name: pr-desc
description: Write pull request descriptions from local git changes. Use when asked to summarize a branch diff into PR-ready markdown, including goal discovery, breaking-change detection, and template-based formatting. Select base branch as `main`/`master` by default, or `moonbeam-polkadot-stableNNNN` when the user provides a 4-digit release number.
---

# PR Description Writer

Follow this workflow to produce a paste-ready PR description.

## 1) Determine base branch

1. Use `moonbeam-polkadot-stableNNNN` when the user explicitly provides a 4-digit number (`NNNN`).
2. Otherwise prefer `main` if it exists, else `master`.
3. Confirm the selected base branch exists locally before diffing.

## 2) Review changes

1. Compute the effective diff against the merge-base with the selected base branch.
2. Read changed files and commit messages as needed to understand intent.
3. Capture concise notes for: purpose, key behavioral changes, testing, migration/ops impact.

## 3) Infer and confirm goal

1. Infer the main goal from the diff.
2. If the goal is ambiguous, propose 2-4 plausible goals and ask the user to choose before drafting the final description.

## 4) Detect breaking changes

Check whether changes impact:

- Users and integrators (public APIs, RPCs, runtime/extrinsic behavior, storage formats)
- External tooling (indexers, SDK assumptions, event formats)
- Node operators (CLI flags, defaults, config/env vars, runtime upgrade constraints)

If any breaking change exists, start the PR description with exactly:

`## :warning: Breaking changes :warning:`

Then list the concrete breakage and required migration actions.

## 5) Build description body

1. If `.pr_desc_template.md` exists at repository root, follow its structure, answer only questions/sections that are truly relevant to the current changes, and skip non-relevant prompts.
2. If the template does not exist, write:
- Goal of the changes
- What reviewers need to know (key implementation decisions, risks, compatibility)

Prefer concrete facts from the diff. Avoid vague claims.

## 6) Return copy/paste-ready markdown

1. Return the full PR description inside exactly one fenced code block so the user can copy in one action.
2. If the PR description itself must include fenced code blocks, wrap the outer fence with four backticks and keep inner blocks as three backticks.
3. Do not prepend or append extra prose outside the final block, except a short ambiguity question when clarification is required.

## Quality bar

- Be precise and reviewer-focused.
- Mention risky areas and migration requirements explicitly.
- Keep wording concise; avoid boilerplate.