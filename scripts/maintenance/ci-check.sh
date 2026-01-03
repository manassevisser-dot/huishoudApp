#!/usr/bin/env bash
set -euo pipefail
export NO_COLOR=1
export QUIET=true
./scripts/maintenance/phoenix-check.sh || exit 1
