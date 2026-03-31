#!/usr/bin/env python3
"""
Analyze git diff of Substrate weight files and flag significant changes.

Usage:
  # Compare current branch against a base branch:
  git diff $(git merge-base <base-branch> HEAD)..HEAD -- '*/weights/*' | python3 scripts/analyze-weight-diff.py

  # Or from a saved diff file:
  python3 scripts/analyze-weight-diff.py --file weight_diff.txt

  # Adjust the threshold for flagging changes (default: 50%):
  python3 scripts/analyze-weight-diff.py --threshold 30
"""

import argparse
import re
import sys
from collections import defaultdict


def parse_weight_block(lines):
    """Parse diff lines belonging to one function and extract weight components."""
    result = {
        "base_ref": 0,
        "base_proof": 0,
        "min_execution_time": None,
        "ref_multipliers": {},
        "proof_multipliers": {},
        "db_reads_base": 0,
        "db_reads_per_var": {},
    }

    for line in lines:
        clean = line.strip()

        min_match = re.search(
            r"Minimum execution time:\s*([\d_]+)\s*picoseconds", clean
        )
        if min_match:
            result["min_execution_time"] = int(min_match.group(1).replace("_", ""))
            continue

        # Base Weight::from_parts — first occurrence NOT inside a saturating_add
        if "saturating_add" not in clean:
            base_match = re.search(
                r"Weight::from_parts\(\s*([\d_]+)\s*,\s*([\d_]+)\s*\)", clean
            )
            if base_match:
                result["base_ref"] = int(base_match.group(1).replace("_", ""))
                result["base_proof"] = int(base_match.group(2).replace("_", ""))
                continue

        # .saturating_add(Weight::from_parts(X, Y).saturating_mul(VAR.into()))
        mul_match = re.search(
            r"\.saturating_add\(Weight::from_parts\(\s*([\d_]+)\s*,\s*([\d_]+)\s*\)"
            r"\.saturating_mul\((\w+)\.into\(\)\)\)",
            clean,
        )
        if mul_match:
            ref_val = int(mul_match.group(1).replace("_", ""))
            proof_val = int(mul_match.group(2).replace("_", ""))
            var_name = mul_match.group(3)
            if ref_val > 0:
                result["ref_multipliers"][var_name] = ref_val
            if proof_val > 0:
                result["proof_multipliers"][var_name] = proof_val
            continue

        # Per-var DB reads: .reads((N_u64).saturating_mul(VAR...))
        reads_match = re.search(
            r"\.reads\(\((\d+)_u64\)\.saturating_mul\((\w+)", clean
        )
        if reads_match:
            result["db_reads_per_var"][reads_match.group(2)] = int(
                reads_match.group(1)
            )
            continue

        # Base DB reads: .reads(N_u64)
        reads_base_match = re.search(r"\.reads\((\d+)_u64\)", clean)
        if reads_base_match and "saturating_mul" not in clean:
            result["db_reads_base"] = int(reads_base_match.group(1))

    return result


def extract_function_diffs(file_lines):
    """Extract per-function old/new weight blocks from unified diff lines."""
    current_fn = None
    fn_removed_lines = defaultdict(list)
    fn_added_lines = defaultdict(list)

    for line in file_lines:
        if line.startswith("---") or line.startswith("+++") or line.startswith("index "):
            continue

        if line.startswith("@@"):
            hunk_fn = re.search(r"fn (\w+)", line)
            if hunk_fn:
                current_fn = hunk_fn.group(1)
            continue

        content = line[1:] if line and line[0] in " +-" else line
        fn_match = re.match(r"\s*fn (\w+)\s*\(", content)
        if fn_match:
            current_fn = fn_match.group(1)

        if current_fn is None:
            continue

        if line.startswith("-") and not line.startswith("---"):
            fn_removed_lines[current_fn].append(line[1:])
        elif line.startswith("+") and not line.startswith("+++"):
            fn_added_lines[current_fn].append(line[1:])

    result = {}
    all_fns = set(fn_removed_lines.keys()) | set(fn_added_lines.keys())

    for fn_name in all_fns:
        removed = fn_removed_lines.get(fn_name, [])
        added = fn_added_lines.get(fn_name, [])
        if not removed and not added:
            continue

        old_block = parse_weight_block(removed)
        new_block = parse_weight_block(added)

        has_old = (
            old_block["base_ref"] > 0
            or old_block["min_execution_time"] is not None
            or old_block["ref_multipliers"]
        )
        has_new = (
            new_block["base_ref"] > 0
            or new_block["min_execution_time"] is not None
            or new_block["ref_multipliers"]
        )

        if has_old or has_new:
            result[fn_name] = (old_block, new_block)

    return result


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def pct(old, new):
    if old == 0:
        return float("inf") if new > 0 else 0.0
    return ((new - old) / old) * 100


def format_weight(val):
    if val >= 1_000_000_000:
        return f"{val / 1_000_000_000:.1f}B"
    elif val >= 1_000_000:
        return f"{val / 1_000_000:.1f}M"
    elif val >= 1_000:
        return f"{val / 1_000:.1f}K"
    return str(val)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Analyze Substrate weight file diffs for significant changes."
    )
    parser.add_argument(
        "--file",
        "-f",
        help="Path to a saved diff file. If omitted, reads from stdin.",
    )
    parser.add_argument(
        "--threshold",
        "-t",
        type=float,
        default=50.0,
        help="Percentage threshold for flagging changes (default: 50).",
    )
    args = parser.parse_args()
    threshold = args.threshold

    if args.file:
        with open(args.file, "r") as f:
            diff_text = f.read()
    else:
        diff_text = sys.stdin.read()

    if not diff_text.strip():
        print("No diff input provided. Pipe a git diff or use --file.")
        sys.exit(1)

    lines = diff_text.split("\n")

    # Split into per-file diffs
    file_diffs = {}
    current_file = None
    current_lines = []

    for line in lines:
        if line.startswith("diff --git"):
            if current_file and current_lines:
                file_diffs[current_file] = current_lines
            match = re.search(r"b/(runtime/\S+)", line)
            current_file = match.group(1) if match else None
            current_lines = []
        elif current_file is not None:
            current_lines.append(line)

    if current_file and current_lines:
        file_diffs[current_file] = current_lines

    all_changes = []
    for filepath, flines in file_diffs.items():
        parts = filepath.split("/")
        runtime = parts[1] if len(parts) > 1 else "unknown"
        pallet = parts[-1].replace(".rs", "") if parts else "unknown"

        fn_diffs = extract_function_diffs(flines)
        for fn_name, (old, new) in fn_diffs.items():
            all_changes.append(
                {
                    "runtime": runtime,
                    "pallet": pallet,
                    "function": fn_name,
                    "old": old,
                    "new": new,
                }
            )

    sep = "=" * 120
    print(sep)
    print(f"WEIGHT DIFF ANALYSIS (threshold: {threshold:.0f}%)")
    print(sep)

    # ------------------------------------------------------------------
    # OVERALL STATS
    # ------------------------------------------------------------------
    total = len(all_changes)
    min_changes = []
    for c in all_changes:
        old_min = c["old"]["min_execution_time"]
        new_min = c["new"]["min_execution_time"]
        if old_min and new_min and old_min > 0:
            min_changes.append(pct(old_min, new_min))

    print(f"\nTotal weight functions with changes: {total}")

    if min_changes:
        ups = len([p for p in min_changes if p > 0])
        downs = len([p for p in min_changes if p < 0])
        avg = sum(min_changes) / len(min_changes)
        sorted_mc = sorted(min_changes)
        median = sorted_mc[len(sorted_mc) // 2]
        print(f"\n  Minimum execution time summary:")
        print(f"    Increases: {ups}, Decreases: {downs}")
        print(f"    Average: {avg:+.1f}%, Median: {median:+.1f}%")
        print(f"    Range: {min(min_changes):+.1f}% to {max(min_changes):+.1f}%")

    # ------------------------------------------------------------------
    # 1. BASE ref_time INCREASES > threshold
    # ------------------------------------------------------------------
    print(f"\n{sep}")
    print(f"SECTION 1: BASE ref_time INCREASE > {threshold:.0f}%")
    print(sep)

    sig_base_inc = []
    for c in all_changes:
        if c["old"]["base_ref"] > 0 and c["new"]["base_ref"] > 0:
            p = pct(c["old"]["base_ref"], c["new"]["base_ref"])
            if p > threshold:
                sig_base_inc.append((c, p))
    sig_base_inc.sort(key=lambda x: x[1], reverse=True)

    if sig_base_inc:
        for c, p in sig_base_inc:
            print(f"  [{c['runtime']}] {c['pallet']}::{c['function']}")
            print(
                f"    base ref_time: {c['old']['base_ref']:,} -> {c['new']['base_ref']:,} ({p:+.1f}%)"
            )
            if c["old"]["min_execution_time"] and c["new"]["min_execution_time"]:
                mp = pct(c["old"]["min_execution_time"], c["new"]["min_execution_time"])
                print(
                    f"    min exec time: {c['old']['min_execution_time']:,} -> {c['new']['min_execution_time']:,} ({mp:+.1f}%)"
                )
    else:
        print("  None found.")

    # ------------------------------------------------------------------
    # 2. BASE ref_time DECREASES > threshold
    # ------------------------------------------------------------------
    print(f"\n{sep}")
    print(f"SECTION 2: BASE ref_time DECREASE > {threshold:.0f}%")
    print(sep)

    sig_base_dec = []
    for c in all_changes:
        if c["old"]["base_ref"] > 0 and c["new"]["base_ref"] > 0:
            p = pct(c["old"]["base_ref"], c["new"]["base_ref"])
            if p < -threshold:
                sig_base_dec.append((c, p))
    sig_base_dec.sort(key=lambda x: x[1])

    if sig_base_dec:
        for c, p in sig_base_dec:
            print(f"  [{c['runtime']}] {c['pallet']}::{c['function']}")
            print(
                f"    base ref_time: {c['old']['base_ref']:,} -> {c['new']['base_ref']:,} ({p:+.1f}%)"
            )
    else:
        print("  None found.")

    # ------------------------------------------------------------------
    # 3. PER-VARIABLE MULTIPLIER CHANGES > threshold
    # ------------------------------------------------------------------
    print(f"\n{sep}")
    print(
        f"SECTION 3: PER-VARIABLE ref_time MULTIPLIER CHANGES > {threshold:.0f}%"
    )
    print(sep)

    sig_mul = []
    for c in all_changes:
        old_muls = c["old"]["ref_multipliers"]
        new_muls = c["new"]["ref_multipliers"]
        all_vars = set(old_muls.keys()) | set(new_muls.keys())
        for var in all_vars:
            old_val = old_muls.get(var, 0)
            new_val = new_muls.get(var, 0)
            if old_val > 0 and new_val > 0:
                p = pct(old_val, new_val)
                if abs(p) > threshold:
                    sig_mul.append((c, var, old_val, new_val, p))
            elif old_val == 0 and new_val > 0:
                sig_mul.append((c, var, old_val, new_val, float("inf")))
            elif old_val > 0 and new_val == 0:
                sig_mul.append((c, var, old_val, new_val, -100.0))

    sig_mul.sort(
        key=lambda x: abs(x[4]) if x[4] != float("inf") else 999999, reverse=True
    )

    if sig_mul:
        by_fn = defaultdict(list)
        for entry in sig_mul:
            c, var, old_val, new_val, p = entry
            key = f"[{c['runtime']}] {c['pallet']}::{c['function']}"
            by_fn[key].append(entry)

        for key in sorted(by_fn.keys()):
            entries = by_fn[key]
            c0 = entries[0][0]
            print(f"\n  {key}")

            for c, var, old_val, new_val, p in entries:
                if p == float("inf"):
                    pstr = "NEW"
                elif p == -100.0:
                    pstr = "REMOVED"
                else:
                    pstr = f"{p:+.1f}%"
                print(
                    f"    per-{var} ref_time: {format_weight(old_val)} -> {format_weight(new_val)} ({pstr})"
                )

            old_reads_per = c0["old"]["db_reads_per_var"]
            new_reads_per = c0["new"]["db_reads_per_var"]
            all_read_vars = set(old_reads_per.keys()) | set(new_reads_per.keys())
            for rv in all_read_vars:
                or_val = old_reads_per.get(rv, 0)
                nr_val = new_reads_per.get(rv, 0)
                if or_val != nr_val:
                    print(f"    per-{rv} DB reads: {or_val} -> {nr_val}")
    else:
        print("  None found.")

    # ------------------------------------------------------------------
    # 4. MINIMUM EXECUTION TIME CHANGES > threshold
    # ------------------------------------------------------------------
    print(f"\n{sep}")
    print(f"SECTION 4: MINIMUM EXECUTION TIME CHANGES > {threshold:.0f}%")
    print(sep)

    sig_min = []
    for c in all_changes:
        old_min = c["old"]["min_execution_time"]
        new_min = c["new"]["min_execution_time"]
        if old_min and new_min and old_min > 0:
            p = pct(old_min, new_min)
            if abs(p) > threshold:
                sig_min.append((c, old_min, new_min, p))
    sig_min.sort(key=lambda x: abs(x[3]), reverse=True)

    if sig_min:
        for c, old_min, new_min, p in sig_min:
            direction = "INCREASE" if p > 0 else "DECREASE"
            print(f"  [{c['runtime']}] {c['pallet']}::{c['function']}")
            print(
                f"    {direction}: {format_weight(old_min)} -> {format_weight(new_min)} ({p:+.1f}%)"
            )
    else:
        print("  None found.")

    # ------------------------------------------------------------------
    # 5. PROOF SIZE MULTIPLIER CHANGES > 100%
    # ------------------------------------------------------------------
    print(f"\n{sep}")
    print("SECTION 5: proof_size PER-VARIABLE CHANGES > 100%")
    print(sep)

    sig_proof = []
    for c in all_changes:
        old_muls = c["old"]["proof_multipliers"]
        new_muls = c["new"]["proof_multipliers"]
        all_vars = set(old_muls.keys()) | set(new_muls.keys())
        for var in all_vars:
            old_val = old_muls.get(var, 0)
            new_val = new_muls.get(var, 0)
            if old_val > 0 and new_val > 0:
                p = pct(old_val, new_val)
                if abs(p) > 100:
                    sig_proof.append((c, var, old_val, new_val, p))
            elif old_val == 0 and new_val > 0:
                sig_proof.append((c, var, old_val, new_val, float("inf")))

    sig_proof.sort(
        key=lambda x: abs(x[4]) if x[4] != float("inf") else 999999, reverse=True
    )

    if sig_proof:
        for c, var, old_val, new_val, p in sig_proof:
            pstr = f"{p:+.1f}%" if p != float("inf") else "NEW"
            print(f"  [{c['runtime']}] {c['pallet']}::{c['function']}")
            print(
                f"    per-{var} proof_size: {format_weight(old_val)} -> {format_weight(new_val)} ({pstr})"
            )
    else:
        print("  None found.")

    # ------------------------------------------------------------------
    # 6. PER-RUNTIME SUMMARY
    # ------------------------------------------------------------------
    print(f"\n{sep}")
    print("SECTION 6: PER-RUNTIME SUMMARY")
    print(sep)

    for rt in ["moonbase", "moonbeam", "moonriver"]:
        rt_items = [c for c in all_changes if c["runtime"] == rt]
        if not rt_items:
            continue

        rt_min_changes = []
        for c in rt_items:
            if (
                c["old"]["min_execution_time"]
                and c["new"]["min_execution_time"]
                and c["old"]["min_execution_time"] > 0
            ):
                rt_min_changes.append(
                    pct(c["old"]["min_execution_time"], c["new"]["min_execution_time"])
                )

        if rt_min_changes:
            ups = len([p for p in rt_min_changes if p > 0])
            downs = len([p for p in rt_min_changes if p < 0])
            avg = sum(rt_min_changes) / len(rt_min_changes)
            big_ups = len([p for p in rt_min_changes if p > threshold])
            big_downs = len([p for p in rt_min_changes if p < -threshold])
            print(f"\n  {rt}: {len(rt_items)} functions changed")
            print(
                f"    Min exec time: {ups} increases, {downs} decreases, avg {avg:+.1f}%"
            )
            if big_ups or big_downs:
                print(
                    f"    Flagged: {big_ups} increases >{threshold:.0f}%, {big_downs} decreases >{threshold:.0f}%"
                )

    # ------------------------------------------------------------------
    # 7. FULL TABLE
    # ------------------------------------------------------------------
    print(f"\n{sep}")
    print("SECTION 7: ALL MINIMUM EXECUTION TIME CHANGES (sorted by |change|)")
    print(sep)
    print(
        f"{'Runtime':<12} {'Pallet':<45} {'Function':<40} {'Old':>12} {'New':>12} {'Change':>8}"
    )
    print(f"{'-' * 12} {'-' * 45} {'-' * 40} {'-' * 12} {'-' * 12} {'-' * 8}")

    all_min = []
    for c in all_changes:
        old_min = c["old"]["min_execution_time"]
        new_min = c["new"]["min_execution_time"]
        if old_min and new_min and old_min > 0:
            p = pct(old_min, new_min)
            all_min.append((c, old_min, new_min, p))
    all_min.sort(key=lambda x: abs(x[3]), reverse=True)

    for c, old_min, new_min, p in all_min:
        print(
            f"{c['runtime']:<12} {c['pallet']:<45} {c['function']:<40} "
            f"{format_weight(old_min):>12} {format_weight(new_min):>12} {p:>+7.1f}%"
        )


if __name__ == "__main__":
    main()
