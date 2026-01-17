#!/bin/bash

echo "-----------------------------------"
echo "🛠️ GSA Harvester Quality Guard"
echo "-----------------------------------"

# Stap 1: Voer de Node.js validatie uit
node tests/validate.js

# Stap 2: Controleer de exit-status van Node
if [ $? -eq 0 ]; then
    echo "✨ Validatie geslaagd! Code is veilig voor gebruik."
else
    echo "🚨 Validatie mislukt. Los de bracket/syntax fouten op."
    exit 1
fi
