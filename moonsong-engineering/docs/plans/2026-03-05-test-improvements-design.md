# Test Improvements Design

## Context

The repository has 4 test suites but no tests run in CI. CI only checks typos and dead links. The `tests/subagent-driven-dev/` folder contains expensive E2E tests that are no longer needed.

## Decision: Approach A — Minimal CI with structural validation

### Changes

#### Remove `tests/subagent-driven-dev/`

Full E2E scaffold tests (go-fractals, svelte-todo) are too slow and expensive. Delete entirely.

#### New CI workflow: `tests.yml`

Triggers: push to main, PRs, and `workflow_dispatch` (manual).

**Job: `structural`** (runs always, free)
- Validate all `skills/*/SKILL.md` files have valid frontmatter (name + description)
- Validate plugin config consistency across `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.cursor-plugin/plugin.json` (matching versions)
- Run OpenCode pure library tests (`tests/opencode/test-plugin-loading.sh`, `test-skills-core.sh`)

**Job: `llm-tests`** (manual trigger only via `workflow_dispatch`)
- Run `tests/skill-triggering/run-all.sh`
- Run `tests/explicit-skill-requests/run-all.sh`
- Run `tests/claude-code/run-skill-tests.sh`
- Requires `claude` CLI + API key as repository secret

#### New test script: `tests/structural/validate-skills.sh`

Bash script that:
- Iterates all `skills/*/SKILL.md` files
- Checks frontmatter delimiters exist
- Validates `name:` and `description:` are non-empty
- Checks all three plugin config versions match

### What stays unchanged

- `tests/claude-code/` — kept, wired to manual CI trigger
- `tests/skill-triggering/` — kept, wired to manual CI trigger
- `tests/explicit-skill-requests/` — kept, wired to manual CI trigger
- `tests/opencode/` — kept, wired to structural CI job
- `tests/claude-code/analyze-token-usage.py` — utility, stays

## Plugin targets

All three plugins are covered: Claude Code, OpenCode, Cursor.
