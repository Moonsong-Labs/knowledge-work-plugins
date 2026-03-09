#!/bin/bash
# Run all test suites
# Usage: ./tests/run-all.sh
#
# Requires ANTHROPIC_API_KEY and Claude Code CLI installed.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PASSED=0
FAILED=0
RESULTS=()

run_suite() {
    local name="$1"
    local cmd="$2"

    echo ""
    echo "========================================"
    echo "  $name"
    echo "========================================"
    echo ""

    if eval "$cmd"; then
        PASSED=$((PASSED + 1))
        RESULTS+=("PASS: $name")
    else
        FAILED=$((FAILED + 1))
        RESULTS+=("FAIL: $name")
    fi
}

run_suite "Skill Triggering" "$SCRIPT_DIR/skill-triggering/run-all.sh"
run_suite "Explicit Skill Requests" "$SCRIPT_DIR/explicit-skill-requests/run-all.sh"
run_suite "Claude Code Skill Tests" "$SCRIPT_DIR/claude-code/run-skill-tests.sh"

echo ""
echo "========================================"
echo "  Final Summary"
echo "========================================"
for result in "${RESULTS[@]}"; do
    echo "  $result"
done
echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Total: $((PASSED + FAILED))"

if [ "$FAILED" -gt 0 ]; then
    exit 1
fi
