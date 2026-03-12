#!/bin/bash
# Run all agent triggering tests
# Usage: ./run-all.sh

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SHARED_RUNNER="$SCRIPT_DIR/../shared/run-agent-test.sh"
PROMPTS_DIR="$SCRIPT_DIR/prompts"

AGENTS=(
    "rust-specialist"
    "dependency-manager"
    "documentation-specialist"
    "git-workflow-manager"
    "code-reviewer"
)

echo "=== Running Agent Triggering Tests ==="
echo ""

PASSED=0
FAILED=0
RESULTS=()

for agent in "${AGENTS[@]}"; do
    prompt_file="$PROMPTS_DIR/${agent}.txt"

    if [ ! -f "$prompt_file" ]; then
        echo "⚠️  SKIP: No prompt file for $agent"
        continue
    fi

    echo "Testing: $agent"

    if "$SHARED_RUNNER" "$agent" "$prompt_file" 4 2>&1 | tee "/tmp/agent-test-$agent.log"; then
        PASSED=$((PASSED + 1))
        RESULTS+=("✅ $agent")
    else
        FAILED=$((FAILED + 1))
        RESULTS+=("❌ $agent")
    fi

    echo ""
    echo "---"
    echo ""
done

echo ""
echo "=== Summary ==="
for result in "${RESULTS[@]}"; do
    echo "  $result"
done
echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [ $FAILED -gt 0 ]; then
    exit 1
fi
