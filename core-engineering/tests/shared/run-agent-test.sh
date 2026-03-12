#!/bin/bash
# Shared test runner for agent dispatch tests
# Usage: ./run-agent-test.sh <agent-name> <prompt-file> [max-turns]
#
# Tests whether Claude dispatches a specialist agent given a prompt.
# Checks for Agent tool invocations with the expected subagent_type.
#
# Creates an isolated project directory with a dummy plan file,
# runs Claude, and checks whether the expected agent was dispatched.

set -e

AGENT_NAME="$1"
PROMPT_FILE="$2"
MAX_TURNS="${3:-4}"

if [ -z "$AGENT_NAME" ] || [ -z "$PROMPT_FILE" ]; then
    echo "Usage: $0 <agent-name> <prompt-file> [max-turns]"
    echo "Example: $0 rust-specialist ./prompts/rust-specialist.txt"
    exit 1
fi

# Get the directory where THIS script lives
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the skills plugin root (two levels up from tests/shared)
PLUGIN_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

TIMESTAMP=$(date +%s)
OUTPUT_DIR="/tmp/skills-tests/${TIMESTAMP}/${AGENT_NAME}"
mkdir -p "$OUTPUT_DIR"

# Read prompt from file
PROMPT=$(cat "$PROMPT_FILE")

echo "=== Agent Dispatch Test ==="
echo "Agent: $AGENT_NAME"
echo "Prompt file: $PROMPT_FILE"
echo "Max turns: $MAX_TURNS"
echo "Output dir: $OUTPUT_DIR"
echo ""

# Copy prompt for reference
cp "$PROMPT_FILE" "$OUTPUT_DIR/prompt.txt"

# Create a minimal project directory for the test
PROJECT_DIR="$OUTPUT_DIR/project"
mkdir -p "$PROJECT_DIR/docs/plans"

# Create a dummy plan file for tests that reference plans
cat >"$PROJECT_DIR/docs/plans/auth-system.md" <<'EOF'
# Auth System Implementation Plan

## Task 1: Add User Model
Create user model with email and password fields.

## Task 2: Add Auth Routes
Create login and register endpoints.

## Task 3: Add JWT Middleware
Protect routes with JWT validation.
EOF

# Run Claude with isolated environment
# Unset CLAUDECODE to allow running tests from within a Claude Code terminal
unset CLAUDECODE 2>/dev/null || true
LOG_FILE="$OUTPUT_DIR/claude-output.json"
cd "$PROJECT_DIR"

echo "Plugin dir: $PLUGIN_DIR"
echo "Running claude -p..."
echo "Prompt: $PROMPT"
echo ""

timeout --foreground 300 claude -p "$PROMPT" \
    --plugin-dir "$PLUGIN_DIR" \
    --dangerously-skip-permissions \
    --max-turns "$MAX_TURNS" \
    --verbose \
    --output-format stream-json \
    >"$LOG_FILE" 2>&1 || true

echo ""
echo "=== Results ==="

# Check if the expected specialist agent was dispatched
# Agent tool invocations have "name":"Agent" with subagent_type in the input
AGENT_PATTERN="\"subagent_type\":\"([^\"]*:)?${AGENT_NAME}\""
if grep -q '"name":"Agent"' "$LOG_FILE" && grep -qE "$AGENT_PATTERN" "$LOG_FILE"; then
    echo "PASS: Agent '$AGENT_NAME' was dispatched"
    DISPATCHED=true
else
    echo "FAIL: Agent '$AGENT_NAME' was NOT dispatched"
    DISPATCHED=false
fi

# Show what agents WERE dispatched
echo ""
echo "Agents dispatched in this run:"
grep -o '"subagent_type":"[^"]*"' "$LOG_FILE" 2>/dev/null | sort -u || echo "  (none)"

# Also show skills triggered (context for debugging)
echo ""
echo "Skills triggered in this run:"
grep -o '"skill":"[^"]*"' "$LOG_FILE" 2>/dev/null | sort -u || echo "  (none)"

# Check if Claude took action BEFORE invoking the skill or agent
echo ""
echo "Checking for premature action..."

FIRST_SKILL_LINE=$(grep -n '"name":"Skill"' "$LOG_FILE" | head -1 | cut -d: -f1)
if [ -n "$FIRST_SKILL_LINE" ]; then
    PREMATURE_TOOLS=$(head -n "$FIRST_SKILL_LINE" "$LOG_FILE" |
        grep '"type":"tool_use"' |
        grep -v '"name":"Skill"' |
        grep -v '"name":"TodoWrite"' |
        grep -v '"name":"TaskCreate"' |
        grep -v '"name":"TaskUpdate"' |
        grep -v '"name":"TaskList"' |
        grep -v '"name":"ToolSearch"' || true)
    if [ -n "$PREMATURE_TOOLS" ]; then
        echo "WARNING: Tools invoked BEFORE Skill tool:"
        echo "$PREMATURE_TOOLS" | head -5
        echo ""
        echo "This indicates Claude started working before loading the skill."
    else
        echo "OK: No premature tool invocations detected"
    fi
else
    echo "WARNING: No Skill invocation found at all"
fi

# Show first assistant message
echo ""
echo "First assistant response (truncated):"
grep '"type":"assistant"' "$LOG_FILE" | head -1 | jq -r '.message.content[0].text // .message.content' 2>/dev/null | head -c 500 || echo "  (could not extract)"

echo ""
echo "Full log: $LOG_FILE"
echo "Timestamp: $TIMESTAMP"

if [ "$DISPATCHED" = "true" ]; then
    exit 0
else
    exit 1
fi
