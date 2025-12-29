#!/bin/bash
FIELDS_DIR="src/ui/components/fields"

# 1. Fix de 'React.FC<Props>' verwarring door een trailing comma toe te voegen
# Dit verandert <Props> naar <Props,> wat de JSX-parser dwingt te stoppen
sed -i 's/React.FC<\([a-zA-Z]*\)>/React.FC<\1,>/g' $FIELDS_DIR/*.tsx

# 2. Fix specifieke 'string' tag error in MoneyInput
sed -i 's/<string>/<string,>/g' $FIELDS_DIR/MoneyInput.tsx

# 3. Herstel de default React imports als die nog ergens overleefd hebben
sed -i "s/import \* as React/import React/g" $FIELDS_DIR/*.tsx