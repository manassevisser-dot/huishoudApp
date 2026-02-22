#!/usr/bin/env bash
set -euo pipefail

# P4: Global Coverage & Quality Gates
# Requirements: 
# - 80% statements
# - 75% branches  
# - 80% functions
# - 80% lines

echo "🔍 [P4-GLOBAL] Ava Audit Script – Quality Gates"
echo "📊 Generating coverage report..."

# Generate coverage
npm test -- --coverage --json --outputFile=coverage-output.json || exit 3

# Extract metrics
STATEMENTS_PCT=$(jq '.total.statements.pct' coverage-output.json)
BRANCHES_PCT=$(jq '.total.branches.pct' coverage-output.json)  
FUNCTIONS_PCT=$(jq '.total.functions.pct' coverage-output.json)
LINES_PCT=$(jq '.total.lines.pct' coverage-output.json)

echo "📈 Coverage Results:"
echo "   Statements: $STATEMENTS_PCT%"
echo "   Branches:   $BRANCHES_PCT%"
echo "   Functions:  $FUNCTIONS_PCT%"
echo "   Lines:      $LINES_PCT%"

# Enforce thresholds
THRESHOLD_STATEMENTS=80
THRESHOLD_BRANCHES=75
THRESHOLD_FUNCTIONS=80
THRESHOLD_LINES=80

# Check statements
if (( $(echo "$STATEMENTS_PCT < $THRESHOLD_STATEMENTS" | bc -l) )); then
    echo "❌ FAIL: Statements coverage ($STATEMENTS_PCT%) below threshold ($THRESHOLD_STATEMENTS%)"
    exit 4
fi

# Check branches
if (( $(echo "$BRANCHES_PCT < $THRESHOLD_BRANCHES" | bc -l) )); then
    echo "❌ FAIL: Branches coverage ($BRANCHES_PCT%) below threshold ($THRESHOLD_BRANCHES%)"
    exit 5
fi

# Check functions
if (( $(echo "$FUNCTIONS_PCT < $THRESHOLD_FUNCTIONS" | bc -l) )); then
    echo "❌ FAIL: Functions coverage ($FUNCTIONS_PCT%) below threshold ($THRESHOLD_FUNCTIONS%)"
    exit 6
fi

# Check lines
if (( $(echo "$LINES_PCT < $THRESHOLD_LINES" | bc -l) )); then
    echo "❌ FAIL: Lines coverage ($LINES_PCT%) below threshold ($THRESHOLD_LINES%)"
    exit 7
fi

echo "✅ [P4-GLOBAL] QUALITY GATES PASSED"
echo "🚀 Ready for release"