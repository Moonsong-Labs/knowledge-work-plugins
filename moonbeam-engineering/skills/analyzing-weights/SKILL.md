---
name: analyzing-weights
description: Analyzes weight file diffs after benchmarks to flag significant regressions in ref_time, proof_size, and DB reads. Use when updating weights, running benchmarks, or reviewing weight changes.
---

# Analyzing Weights

Analyzes weight file changes between the current branch and a base branch to detect significant regressions or anomalies introduced by benchmark updates.

## When to use

- After running the runtime benchmarks to regenerate weights
- When reviewing a PR that updates weight files
- When the user asks to check, analyze, or validate weight changes

## Workflow

### 1) Determine the base branch

1. If the user provides a base branch name, use it.
2. Otherwise, infer from the current branch context:
   - Use `perm-runtime-NNNN` if the branch name or commits suggest a release.
   - Fall back to `master`.
3. Confirm the base branch exists locally before proceeding.

### 2) Generate and parse the weight diff

Run the analysis script piping the git diff of weight files:

```bash
git diff $(git merge-base <base-branch> HEAD)..HEAD -- '*/weights/*' \
  | python3 .claude/skills/analyzing-weights/scripts/analyze-weight-diff.py --threshold 50
```

The script accepts:
- `--file <path>` or stdin (piped diff)
- `--threshold <N>` percentage threshold for flagging (default: 50)

### 3) Interpret the report

The script produces 7 sections:

| Section | What it flags                                                              |
|---------|----------------------------------------------------------------------------|
| 1       | Base ref_time increases above threshold                                    |
| 2       | Base ref_time decreases above threshold                                    |
| 3       | Per-variable ref_time multiplier changes (critical for parametric weights) |
| 4       | Minimum execution time changes above threshold                             |
| 5       | proof_size per-variable changes above 100%                                 |
| 6       | Per-runtime summary (moonbase, moonbeam, moonriver)                        |
| 7       | Full sorted table of all minimum execution time changes                    |

### 4) Flag concerns

After reviewing the script output, flag:

- **Per-variable multiplier explosions**: If a per-`x` or per-`y` coefficient grows by 10x+, compute the charged weight at mainnet parameters (see reference values below) and check whether it exceeds block limits.
- **proof_size overflow**: Compute `proof_size` at mainnet parameters. If it exceeds 10 MB (PoV limit), flag it as a blocker.
- **Benchmark range vs mainnet range**: Check whether the benchmark's linear parameter ranges cover the actual mainnet values. If mainnet values exceed the benchmark range, the weight formula extrapolates and may be inaccurate.

### 5) Mainnet reference values

Use these for impact calculations:

| Parameter                        | Moonbeam               | Moonriver | Moonbase |
|----------------------------------|------------------------|-----------|----------|
| Block ref_time limit             | 2,000,000,000,000 (2T) | 2T        | 2T       |
| Block PoV limit                  | 10,485,760 (10 MB)     | 10 MB     | 10 MB    |
| TotalSelected (collators)        | ~64                    | ~24       | ~16      |
| MaxTopDelegationsPerCandidate    | 300                    | 300       | 300      |
| MaxDelegationsPerDelegator       | 100                    | 100       | 100      |
| MaxBottomDelegationsPerCandidate | 50                     | 50        | 50       |

### 6) Present findings

Summarize to the user:

1. **Overall trend**: Are weights mostly stable, increasing, or decreasing?
2. **Flagged regressions**: List any extrinsic with changes above threshold, with context on whether it matters at mainnet scale.
3. **Blockers**: If any charged weight at mainnet parameters exceeds block limits, call it out explicitly.
4. **Recommendation**: Whether the weight update is safe to merge as-is or needs investigation.
