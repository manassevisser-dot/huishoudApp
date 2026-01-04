#!/usr/bin/env bash
set -euo pipefail

# Ga naar projectroot (zeker doen als dit script vanuit CI of andere mappen draait)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

# Gebruik de package manager die je gebruikt (npm/pnpm/yarn)
npm run sync:aliases

