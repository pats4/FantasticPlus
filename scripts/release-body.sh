#!/usr/bin/env bash
# Print a release description: the tag's section of CHANGELOG.md, then how it was built.
# Usage: scripts/release-body.sh <tag> <commit> [run-url]
set -euo pipefail
cd "$(dirname "$0")/.."
tag="$1"; commit="$2"; run="${3:-}"

notes="$(awk -v h="## $tag" '$0 == h {on = 1; next} on && /^## / {exit} on' CHANGELOG.md)"
if [ -z "$(printf '%s' "$notes" | tr -d '[:space:]')" ]; then
    echo "CHANGELOG.md has no '## $tag' section" >&2
    exit 1
fi
printf '%s\n\n---\n\n' "$(printf '%s\n' "$notes" | sed -e '/./,$!d')"
printf 'Built by GitHub Actions from commit %s%s.\n' "$commit" "${run:+, run $run}"
echo 'No prebuilt binaries are stored in the repository; check `SHA256SUMS` against your own `./build.sh` output if you like.'
echo
echo 'Not yet tested on real Steam Deck / ROG Ally hardware: watch temperatures and `/tmp/fantasticplus.log` on first use.'
