#!/usr/bin/env bash
# phoenix-audit-full-architecture.sh

set -euo pipefail

echo "🚀 Start audit: Volledige architectuur (Orchestrator-Reducer-Context)"

./forbidden-patterns.sh
./sentinel-patterns.sh  
./dependency-graph.sh
./adr-compliance.sh
./formcontext-checklist.sh

# Optioneel: functionele tests
# ./test-cases.sh

echo "🎉 Audit SUCCESS: Volledige architectuur conformeert aan ideale samenwerking"