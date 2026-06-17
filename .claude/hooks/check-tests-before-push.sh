#!/usr/bin/env bash
# Checks that every source file being pushed has a corresponding test file.
# Outputs a permissionDecision:ask JSON if any are missing, so Claude is
# prompted to add tests before the push goes through.

upstream=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "origin/main")

files=$(git diff --name-only "${upstream}"..HEAD -- src/ 2>/dev/null \
  | grep -E '\.(ts|tsx)$' \
  | grep -v '__tests__\|\.test\.\|\.spec\.')

[[ -z "$files" ]] && exit 0

missing=()
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  dir=$(dirname "$f")
  base=$(basename "$f"); base="${base%.tsx}"; base="${base%.ts}"
  ls "${dir}/__tests__/${base}.test."* 2>/dev/null | grep -q . || missing+=("$f")
done <<< "$files"

[[ ${#missing[@]} -eq 0 ]] && exit 0

jq -n --arg reason "$(printf 'These source files are missing tests:\n'; printf '  - %s\n' "${missing[@]}"; printf '\nAdd tests before pushing, or confirm to push anyway.')" \
  '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":$reason}}'
