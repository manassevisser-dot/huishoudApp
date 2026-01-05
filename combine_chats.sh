#!/bin/bash

# App Journey Combiner - Linux/Bash versie
# Combineert 37 .md ChatGPT exports naar MD + JSONL

SOURCE_DIR="/home/user/pre7/chat_files"
OUTPUT_DIR="/home/user/pre7/SAMENVATTING"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
MD_OUTPUT="${OUTPUT_DIR}/app_journey_${TIMESTAMP}.md"
JSONL_OUTPUT="${OUTPUT_DIR}/app_journey_${TIMESTAMP}.jsonl"

echo "🚀 App Journey Combiner"
echo "📁 Source: ${SOURCE_DIR}"
echo "📁 Output: ${OUTPUT_DIR}"
echo ""

# Maak output directory aan als die niet bestaat
mkdir -p "${OUTPUT_DIR}"

# Tel aantal .md files
TOTAL_FILES=$(find "${SOURCE_DIR}" -maxdepth 1 -name "*.md" -type f | wc -l)
echo "📊 Gevonden: ${TOTAL_FILES} .md bestanden"

if [ ${TOTAL_FILES} -eq 0 ]; then
    echo "❌ Geen .md bestanden gevonden in ${SOURCE_DIR}"
    exit 1
fi

# === MARKDOWN OUTPUT ===
echo "📝 Schrijven naar Markdown..."

cat > "${MD_OUTPUT}" << EOF
# 🚀 My App Journey: Van Excel naar React Native

**Gegenereerd:** $(date '+%Y-%m-%d %H:%M:%S')
**Totaal gesprekken:** ${TOTAL_FILES}
**Bron:** ChatGPT exports

---

EOF

# Sorteer op datum (LastWriteTime) en verwerk elk bestand
COUNTER=0
find "${SOURCE_DIR}" -maxdepth 1 -name "*.md" -type f -printf "%T@ %p\n" | sort -n | while read timestamp filepath; do
    COUNTER=$((COUNTER + 1))
    filename=$(basename "${filepath}")
    filedate=$(stat -c %y "${filepath}" | cut -d'.' -f1)
    
    echo -ne "\r⏳ Verwerken: ${COUNTER}/${TOTAL_FILES} - ${filename}                    "
    
    # Schrijf header naar MD
    cat >> "${MD_OUTPUT}" << EOF

# 📄 ${filename}

**Datum:** ${filedate}
**Bestand:** ${COUNTER}/${TOTAL_FILES}

---

EOF
    
    # Voeg de content toe
    cat "${filepath}" >> "${MD_OUTPUT}"
    
    # Voeg separator toe
    echo -e "\n\n---\n" >> "${MD_OUTPUT}"
    
    # === JSONL OUTPUT ===
    # Escape quotes en newlines voor JSON
    content=$(cat "${filepath}" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}' | sed 's/\\n$//')
    
    # Schrijf JSON object naar JSONL (1 regel per bestand)
    cat >> "${JSONL_OUTPUT}" << EOF
{"filename":"${filename}","date":"${filedate}","counter":${COUNTER},"content":"${content}"}
EOF
    echo "" >> "${JSONL_OUTPUT}"
    
done

echo -e "\n"
echo "✅ Klaar!"
echo ""
echo "📊 Statistieken:"
echo "   - Verwerkt: ${TOTAL_FILES} bestanden"
echo ""
echo "📁 Output bestanden:"
echo "   - Markdown: ${MD_OUTPUT}"
echo "   - JSONL:    ${JSONL_OUTPUT}"
echo ""
echo "💡 Volgende stappen:"
echo "   1. Upload de .md naar Claude voor verhaal-analyse"
echo "   2. Gebruik de .jsonl voor data-analyse"
echo ""
echo "🎯 Preview van bestanden:"
ls -lh "${MD_OUTPUT}" "${JSONL_OUTPUT}"