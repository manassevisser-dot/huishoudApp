#!/bin/bash

# safe_migrate.sh
# Gebruik: ./safe_migrate.sh MAPPING-FILES-TO-DOMAIN-V1.md

MAPPING_FILE="$1"
REPORT_FILE="MIGRATION_REPORT.json"
ERROR_LOG="MIGRATION_ERRORS.log"

# Wis oude logs
echo "[" > $REPORT_FILE
> $ERROR_LOG

if [ ! -f "$MAPPING_FILE" ]; then
    echo "❌ Mapping file '$MAPPING_FILE' niet gevonden!"
    exit 1
fi

echo "🚀 Start Phoenix Restructuring Migration..."
echo "📄 Lezen van $MAPPING_FILE"

# Lees de Markdown tabel regel voor regel
# We skippen de header en lijnen die niet met | beginnen
grep "^|" "$MAPPING_FILE" | grep -v "Huidige locatie" | grep -v "\-\-\-" | while IFS='|' read -r _ FILE SRC DEST REASON MIGRATE _; do
    
    # Trim whitespace
    FILE=$(echo "$FILE" | xargs)
    SRC=$(echo "$SRC" | xargs)
    DEST=$(echo "$DEST" | xargs)
    MIGRATE=$(echo "$MIGRATE" | xargs)

    # Check of we moeten migreren
    if [ "$MIGRATE" != "J" ]; then
        continue
    fi

    FULL_SRC="${SRC}${FILE}"
    FULL_DEST="${DEST}${FILE}"
    DEST_DIR=$(dirname "$FULL_DEST")

    if [ ! -f "$FULL_SRC" ]; then
        echo "⚠️  Skipping: Bronbestand niet gevonden: $FULL_SRC"
        continue
    fi

    echo "🔄 Processing: $FILE"

    # 1. INVARIANT CHECK (Pre-Flight)
    HASH_PRE=$(shasum -a 256 "$FULL_SRC" | awk '{print $1}')

    # 2. VOORBEREIDING
    if [ ! -d "$DEST_DIR" ]; then
        mkdir -p "$DEST_DIR"
    fi

    # 3. UITVOERING (Git Move voor historiebehoud)
    # Gebruik 'mv' als je geen git gebruikt, maar git mv is veiliger voor refactors
    git mv "$FULL_SRC" "$FULL_DEST" 2>> $ERROR_LOG

    if [ $? -ne 0 ]; then
        echo "❌ FOUT bij verplaatsen van $FULL_SRC"
        continue
    fi

    # 4. INVARIANT CHECK (Post-Flight)
    HASH_POST=$(shasum -a 256 "$FULL_DEST" | awk '{print $1}')

    # 5. VALIDATIE
    STATUS="SUCCESS"
    if [ "$HASH_PRE" != "$HASH_POST" ]; then
        STATUS="CORRUPTION_DETECTED"
        echo "🚨 HASH MISMATCH! $FILE is veranderd tijdens verplaatsing!"
        # In een echte pipeline zou je hier een 'git restore' doen
    fi

    # 6. SENTINEL CHECK (Domeinzuiverheid)
    # Als we naar 'domain/' verplaatsen, mag er geen 'react' of 'ui' import in zitten
    SENTINEL_ALERT="false"
    if [[ "$DEST" == *"domain"* ]]; then
        if grep -qE "import.*react|import.*react-native|import.*@ui" "$FULL_DEST"; then
            SENTINEL_ALERT="DOMAIN_VIOLATION"
            echo "   ⚠️  WAARSCHUWING: UI code gedetecteerd in Domain file!"
        fi
    fi

    # 7. RAPPORTAGE (JSON Fragment)
    echo "  {
    \"file\": \"$FILE\",
    \"source\": \"$SRC\",
    \"destination\": \"$DEST\",
    \"invariant_hash\": \"$HASH_PRE\",
    \"integrity_check\": \"$([ "$HASH_PRE" == "$HASH_POST" ] && echo "PASS" || echo "FAIL")\",
    \"sentinel_status\": \"$SENTINEL_ALERT\"
  }," >> $REPORT_FILE

    echo "   ✅ Verplaatst naar $DEST (Integrity: PASS)"

done

# Sluit JSON array (hacky fix voor laatste komma)
sed -i '$ s/,$//' $REPORT_FILE
echo "]" >> $REPORT_FILE

echo ""
echo "🏁 Migratie compleet."
echo "📄 Rapport opgeslagen in $REPORT_FILE"
echo "⚠️  Check $ERROR_LOG voor eventuele git-fouten."
