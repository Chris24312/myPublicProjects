#!/usr/bin/env python3

from __future__ import annotations
import argparse
import sys
from typing import List, Tuple
import re

DEFAULT_SEP = "\t"
SEP_ALIASES = {
    "tab": "\t",
    "\\t": "\t",
    "comma": ",",
    ",": ",",
    "semicolon": ";",
    ";": ";",
    "pipe": "|",
    "|": "|",
}


def detect_separator_from_headers(headers: List[str]) -> str:
    for h in headers:
        if h.lower().startswith("#separator:"):
            val = h.split(":", 1)[1].strip().lower()
            return SEP_ALIASES.get(val, DEFAULT_SEP)
    return DEFAULT_SEP


def process_lines(lines: List[str]) -> Tuple[List[str], int, int]:
    """Process the given file lines and return (out_lines, processed_count, skipped_count).

    - Preserves header lines (starting with '#').
    - Detects separator from headers if possible.
    - Swaps the first two columns of each non-header data line.
    - Leaves other columns (e.g., tags column) unchanged.
    """
    headers = [ln for ln in lines if ln.startswith("#")]
    body = [ln for ln in lines if not ln.startswith("#")]

    sep = detect_separator_from_headers(headers)

    out_lines: List[str] = []
    out_lines.extend(headers)

    processed = 0
    skipped = 0

    # helper to extract simple HTML/whitespace wrappers from start/end of a field
    # we consider sequences of <br>, <br/>, &nbsp;, and whitespace as wrappers
    WRAPPER_RE = re.compile(r'^(?P<prefix>(?:\s|(?:&nbsp;)|(?:<br\s*/?>))*)(?P<core>.*?)(?P<suffix>(?:\s|(?:&nbsp;)|(?:<br\s*/?>))*)$', re.IGNORECASE)

    def split_wrappers(s: str) -> Tuple[str, str, str]:
        m = WRAPPER_RE.match(s)
        if not m:
            return "", s, ""
        return m.group('prefix'), m.group('core'), m.group('suffix')

    for ln in body:
        # keep original newline endings normalized to \n
        stripped = ln.rstrip("\r\n")
        if stripped.strip() == "":
            out_lines.append("\n")
            continue

        parts = stripped.split(sep)
        if len(parts) < 2:
            # Can't swap, keep original line
            out_lines.append(ln if ln.endswith("\n") else ln + "\n")
            skipped += 1
            continue

        # Swap only the core text of the first two columns, preserving simple HTML wrappers
        left = parts[0]
        right = parts[1]

        l_pref, l_core, l_suf = split_wrappers(left)
        r_pref, r_core, r_suf = split_wrappers(right)

        # New left gets the right core (no wrappers from right)
        new_left = r_core
        # New right keeps its original wrappers and receives the left core
        new_right = r_pref + l_core + r_suf

        parts[0] = new_left
        parts[1] = new_right
        out_lines.append(sep.join(parts) + "\n")
        processed += 1

    return out_lines, processed, skipped


def main(argv: List[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Reverse front/back in Anki plain-text export.")
    p.add_argument("input", help="Input text file (Anki plain-text export).")
    p.add_argument("-o", "--output", help="Output file path. Defaults to input_reversed.txt")
    args = p.parse_args(argv)

    out_path = args.output or args.input.rsplit(".", 1)[0] + "_reversed.txt"

    try:
        with open(args.input, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading input file: {e}", file=sys.stderr)
        return 2

    out_lines, processed, skipped = process_lines(lines)

    try:
        with open(out_path, "w", encoding="utf-8", newline="\n") as f:
            f.writelines(out_lines)
    except Exception as e:
        print(f"Error writing output file: {e}", file=sys.stderr)
        return 3

    print(f"Done. Processed: {processed}, Skipped: {skipped}. Wrote: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
