#!/usr/bin/env bash
# Runs the test suite before allowing a commit. Blocks on failure.

output=$(npm test 2>&1)
rc=$?

if [ $rc -ne 0 ]; then
  jq -n --arg out "$(echo "$output" | tail -30)" \
    '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":("Tests failed — fix before committing:\n\n" + $out)}}'
fi
