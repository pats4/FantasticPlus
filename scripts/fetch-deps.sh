#!/usr/bin/env bash
# Check out NGnius's libraries at the exact commits this plugin is built and tested
# with. They reference each other by relative path, so they live side by side in
# ./deps (git-ignored).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p deps

fetch() { # name url commit
    local dir="deps/$1"
    if [ ! -d "$dir/.git" ]; then
        git clone --quiet "$2" "$dir"
    fi
    git -C "$dir" fetch --quiet origin
    git -C "$dir" checkout --quiet --detach "$3"
    echo "$1 @ $(git -C "$dir" rev-parse --short HEAD)"
}

fetch usdpl-rs  https://git.ngram.ca/NG-SD-Plugins/usdpl-rs.git 9171682e4d1e73ed650b1623fe9dadd11b661340
fetch nRPC      https://git.ngram.ca/NGnius/nRPC.git            d07cba6a380c0f4831fcf4c164f53575fd185e25
fetch sysfs-nav https://git.ngram.ca/NGnius/sysfs-nav.git       25896dcb7d0f867b734c5bf33c9b66861800c595
