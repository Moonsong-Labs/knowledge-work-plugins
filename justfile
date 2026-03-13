markdownlint_cmd := "bunx markdownlint-cli2@0.21.0"
shellcheck_cmd := "bunx shellcheck@4.1.0"
shfmt_cmd := "go run mvdan.cc/sh/v3/cmd/shfmt@v3.13.0"
actionlint_cmd := "go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.9"
shell_files_cmd := "{ find core-engineering -type f -name '*.sh'; printf '%s\n' core-engineering/hooks/session-start; } | sort"

default:
  @just --list

markdown:
  {{markdownlint_cmd}}

typos:
  typos --no-ignore-vcs

markdown-fmt:
  {{markdownlint_cmd}} --fix

fmt: markdown-fmt shell-fmt

lint: markdown shellcheck shfmt-check yamllint actionlint skills-spec typos

check: lint test

fix: fmt lint

shellcheck:
  set -eu; shell_files="$({{shell_files_cmd}})"; {{shellcheck_cmd}} -x $shell_files

shfmt-check:
  set -eu; shell_files="$({{shell_files_cmd}})"; {{shfmt_cmd}} -d -i 4 -ci $shell_files

shell-fmt:
  set -eu; shell_files="$({{shell_files_cmd}})"; {{shfmt_cmd}} -w -i 4 -ci $shell_files

yamllint:
  yamllint .github

actionlint:
  {{actionlint_cmd}}

skills-spec:
  set -eu
  find . -path '*/SKILL.md' -print0 | xargs -0 -n1 dirname | sort -u | while IFS= read -r skill_dir; do skills-ref validate "$skill_dir"; done

test-skill-triggering:
  ./core-engineering/tests/skill-triggering/run-all.sh

test-explicit-skill-requests:
  ./core-engineering/tests/explicit-skill-requests/run-all.sh

test-claude-code:
  ./core-engineering/tests/claude-code/run-skill-tests.sh --timeout 900

test-agent-triggering:
  ./core-engineering/tests/agent-triggering/run-all.sh

test: test-skill-triggering test-explicit-skill-requests test-claude-code test-agent-triggering
