#!/bin/bash

# 1. De Brug laden (jouw 'phoenix' bestand)
if [ -f "./phoenix" ]; then
    source "./phoenix" 2>/dev/null
else
    echo "❌ FOUT: Brug niet gevonden."
    exit 1
fi

# 2. Gebruik de Brug om te loggen
log_info "DEDUP_START"

# Hieronder komt de Bash-logica om bestanden te vergelijken...
# (niet de TypeScript code zelf!)
log_ok "FINISH"