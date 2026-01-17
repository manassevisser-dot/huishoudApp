#!/bin/bash

# generate-svz0.sh
# Usage: ./generate-svz0.sh <input_file> [artifact_suffix]
# Example: ./generate-svz0.sh gsa_scraper.user.js GSA-V8.0.0

set -e

INPUT_FILE="$1"
ARTIFACT_SUFFIX="${2:-MANUAL}"

if [ -z "$INPUT_FILE" ] || [ ! -f "$INPUT_FILE" ]; then
  echo "❌ Gebruik: $0 <input_bestand> [artifact_suffix]"
  echo "   Voorbeeld: $0 gsa.user.js GSA-V8.0.0"
  exit 1
fi

# Lees de pure inhoud (zonder metadata)
CONTENT="$(cat "$INPUT_FILE")"

# Bereken SHA256 van de pure inhoud
HASH=$(echo -n "$CONTENT" | shasum -a 256 | cut -d' ' -f1)

# Genereer Artifact_ID
ARTIFACT_ID="SVZ-0-${ARTIFACT_SUFFIX}"

# Genereer een unieke output-naam
OUTPUT_FILE="SVZ-0-${ARTIFACT_SUFFIX}.md"

# Vraag om PII bevestiging
echo "🔍 Controleer: bevat het bestand gevoelige gegevens (PII)?"
read -p "(j/N): " PII_RESPONSE

if [[ "${PII_RESPONSE,,}" == "j" || "${PII_RESPONSE,,}" == "y" ]]; then
  PII="JA"
  echo "⚠️  WAARSCHUWING: PII gedetecteerd. Zorg dat dit artefact gesanitized is vóór gebruik in Gate A."
else
  PII="NEE"
fi

# Genereer metadata + inhoud
cat > "$OUTPUT_FILE" <<EOF
## 📦 Metadata (Verplicht voor Gate A)
- **Artifact_ID:** $ARTIFACT_ID
- **Role:** CEO MANASSE
<baseline_integrity>
  SHA256_Hash: $HASH
</baseline_integrity>
- **Source_Commit:** MANUAL_INPUT
- **PII_Attestation:** $PII
- **Status:** PENDING

---

## 📄 Originele Input (SVZ-0)

\`\`\`javascript
$CONTENT
\`\`\`
EOF

echo "✅ SVZ-0 gegenereerd als: $OUTPUT_FILE"
echo "🔒 Hash: $HASH"
echo "ℹ️  Dit artefact is nu Gate A-ready (mits PII-sanitized)."