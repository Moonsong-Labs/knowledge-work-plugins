# Test Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use moonsong-engineering:executing-plans to implement this plan task-by-task.

**Goal:** Add CI test coverage with structural validation on every PR and manual-trigger LLM tests.

**Architecture:** A single `tests.yml` workflow with two jobs: `structural` (always runs, free) validates skill frontmatter, plugin config consistency, and OpenCode library tests; `llm-tests` (manual trigger) runs the existing Claude CLI-based test suites. A new `tests/structural/validate-skills.sh` script handles the structural checks.

**Tech Stack:** Bash, GitHub Actions, Node.js (for OpenCode tests), jq

---

### Task 1: Delete `tests/subagent-driven-dev/`

**Files:**
- Delete: `tests/subagent-driven-dev/` (entire directory)

**Step 1: Remove the directory**

```bash
rm -rf tests/subagent-driven-dev
```

**Step 2: Verify it's gone**

Run: `ls tests/subagent-driven-dev`
Expected: "No such file or directory"

**Step 3: Commit**

```bash
git add -A tests/subagent-driven-dev
git commit -m "chore: remove subagent-driven-dev E2E tests"
```

---

### Task 2: Create `tests/structural/validate-skills.sh`

**Files:**
- Create: `tests/structural/validate-skills.sh`

**Step 1: Write the validation script**

```bash
#!/usr/bin/env bash
# Validate skill structure and plugin config consistency
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "========================================"
echo " Structural Validation"
echo "========================================"
echo ""

errors=0

# --- Validate skill frontmatter ---
echo "--- Validating skill frontmatter ---"
echo ""

for skill_file in "$REPO_ROOT"/skills/*/SKILL.md; do
    skill_dir="$(basename "$(dirname "$skill_file")")"

    # Check frontmatter delimiters exist
    first_line=$(head -1 "$skill_file")
    if [ "$first_line" != "---" ]; then
        echo "  [FAIL] $skill_dir: missing opening frontmatter delimiter"
        errors=$((errors + 1))
        continue
    fi

    # Extract frontmatter content (between first and second ---)
    frontmatter=$(sed -n '2,/^---$/p' "$skill_file" | head -n -1)

    # Check name field
    name=$(echo "$frontmatter" | grep -E '^name:' | sed 's/^name:\s*//' | xargs)
    if [ -z "$name" ]; then
        echo "  [FAIL] $skill_dir: missing or empty 'name' in frontmatter"
        errors=$((errors + 1))
    else
        echo "  [PASS] $skill_dir: name=$name"
    fi

    # Check description field
    description=$(echo "$frontmatter" | grep -E '^description:' | sed 's/^description:\s*//' | xargs)
    if [ -z "$description" ]; then
        echo "  [FAIL] $skill_dir: missing or empty 'description' in frontmatter"
        errors=$((errors + 1))
    fi
done

echo ""

# --- Validate plugin config versions ---
echo "--- Validating plugin config versions ---"
echo ""

claude_version=$(jq -r '.version' "$REPO_ROOT/.claude-plugin/plugin.json")
marketplace_version=$(jq -r '.plugins[0].version' "$REPO_ROOT/.claude-plugin/marketplace.json")
cursor_version=$(jq -r '.version' "$REPO_ROOT/.cursor-plugin/plugin.json")

echo "  .claude-plugin/plugin.json:      $claude_version"
echo "  .claude-plugin/marketplace.json:  $marketplace_version"
echo "  .cursor-plugin/plugin.json:       $cursor_version"

if [ "$claude_version" != "$marketplace_version" ]; then
    echo "  [FAIL] Version mismatch: claude-plugin ($claude_version) != marketplace ($marketplace_version)"
    errors=$((errors + 1))
fi

if [ "$claude_version" != "$cursor_version" ]; then
    echo "  [FAIL] Version mismatch: claude-plugin ($claude_version) != cursor-plugin ($cursor_version)"
    errors=$((errors + 1))
fi

if [ "$claude_version" = "$marketplace_version" ] && [ "$claude_version" = "$cursor_version" ]; then
    echo "  [PASS] All plugin versions match: $claude_version"
fi

echo ""

# --- Summary ---
echo "========================================"
if [ $errors -gt 0 ]; then
    echo " FAILED: $errors error(s) found"
    exit 1
else
    echo " PASSED: All structural checks passed"
    exit 0
fi
```

**Step 2: Make it executable**

Run: `chmod +x tests/structural/validate-skills.sh`

**Step 3: Run the script locally**

Run: `./tests/structural/validate-skills.sh`
Expected: All skills pass frontmatter validation, all versions match, exit 0.

**Step 4: Commit**

```bash
git add tests/structural/validate-skills.sh
git commit -m "test: add structural validation for skills and plugin configs"
```

---

### Task 3: Create `.github/workflows/tests.yml`

**Files:**
- Create: `.github/workflows/tests.yml`

**Step 1: Write the workflow**

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:
    inputs:
      run_llm_tests:
        description: 'Run LLM-based tests (requires ANTHROPIC_API_KEY secret)'
        required: false
        type: boolean
        default: false

jobs:
  structural:
    name: Structural validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Validate skills and plugin configs
        run: ./tests/structural/validate-skills.sh

      - name: Run OpenCode library tests
        run: ./tests/opencode/run-tests.sh

  llm-tests:
    name: LLM-based tests
    if: >-
      github.event_name == 'workflow_dispatch' &&
      github.event.inputs.run_llm_tests == 'true'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code CLI
        run: npm install -g @anthropic-ai/claude-code

      - name: Run skill triggering tests
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: ./tests/skill-triggering/run-all.sh

      - name: Run explicit skill request tests
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: ./tests/explicit-skill-requests/run-all.sh

      - name: Run Claude Code skill tests
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: ./tests/claude-code/run-skill-tests.sh --timeout 900
```

**Step 2: Verify workflow syntax**

Run: `cat .github/workflows/tests.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin)" && echo "Valid YAML"`
Expected: "Valid YAML"

**Step 3: Run the structural job locally to verify**

Run: `./tests/structural/validate-skills.sh && ./tests/opencode/run-tests.sh`
Expected: Both pass.

**Step 4: Commit**

```bash
git add .github/workflows/tests.yml
git commit -m "ci: add tests workflow with structural validation and manual LLM tests"
```

---

### Task 4: Verify everything works end-to-end

**Step 1: Run all structural tests**

Run: `./tests/structural/validate-skills.sh`
Expected: PASSED

**Step 2: Run OpenCode tests**

Run: `./tests/opencode/run-tests.sh`
Expected: PASSED

**Step 3: Verify CI workflow is valid**

Run: `cat .github/workflows/tests.yml | python3 -c "import sys, yaml; yaml.safe_load(sys.stdin)" && echo "Valid YAML"`
Expected: "Valid YAML"

**Step 4: Verify `tests/subagent-driven-dev/` is gone**

Run: `test ! -d tests/subagent-driven-dev && echo "Removed"`
Expected: "Removed"
