import { spawnSync } from "node:child_process";

/**
 * Scans for unresolved merge conflict markers in tracked source files.
 * Excludes markdown and plain-text documentation where these characters
 * legitimately appear as examples (e.g. in README.md or QUALITY_CHECKLIST.md).
 */
const result = spawnSync(
  "git",
  [
    "grep",
    "--line-number",
    "--extended-regexp",
    "^(<{7}|={7}|>{7})",
    "--",
    ":(exclude)*.md",
    ":(exclude)*.txt",
  ],
  { encoding: "utf8" },
);

// git grep exits 0 when matches are found, 1 when no matches, 2+ on error
if (result.status === 0) {
  console.error("Merge conflict markers found:");
  console.error(result.stdout.trim());
  process.exit(1);
} else if (result.status !== null && result.status > 1) {
  console.error("Error running git grep:", result.stderr);
  process.exit(1);
}

console.log("No merge conflicts found.");
