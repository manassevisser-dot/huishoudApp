{
  echo "=== 1. Huidige static-gebruik (ImportOrchestrator.processCsvImport) ==="
  grep -r "static.*processCsvImport" src/app/orchestrators/ || echo "(geen resultaten)"
  echo
  grep -r "ImportOrchestrator.processCsvImport" src/ --include="*.ts" || echo "(geen resultaten)"
  echo

  echo "=== 2. Implements IDataOrchestrator? ==="
  grep -A5 -B5 "implements IDataOrchestrator" src/app/orchestrators/ImportOrchestrator.ts || echo "(bestand of interface niet gevonden)"
  echo

  echo "=== 3. Afhankelijkheden: new ImportOrchestrator & constructor usage ==="
  grep -r "new ImportOrchestrator" src/ || echo "(geen instantiaties gevonden)"
  echo
  grep -r "constructor.*importOrchestrator" src/app/orchestrators/managers/DataManager.ts || echo "(geen injectie in DataManager)"
  echo

  echo "=== 4. Test coverage: DataManager.test.ts ==="
  npx jest src/app/orchestrators/managers/DataManager.test.ts --verbose || echo "(test failed or not found)"
  echo

  echo "=== 5. TypeScript type-check: ImportOrchestrator.ts ==="
  npx tsc --noEmit --skipLibCheck src/app/orchestrators/ImportOrchestrator.ts && echo "✅ Geen TypeScript fouten" || echo "❌ TypeScript fouten aanwezig"
  echo

  echo "=== 6. Simuleer refactoring (verwijder static tijdelijk) ==="
  if [ -f src/app/orchestrators/ImportOrchestrator.ts ]; then
    sed -i.bak 's/static processCsvImport/processCsvImport/g' src/app/orchestrators/ImportOrchestrator.ts
    npx tsc --noEmit --skipLibCheck && echo "✅ Geen fouten na verwijderen static → instance is veilig" || echo "❌ Fouten na verwijderen static → static was verkeerd"
    mv src/app/orchestrators/ImportOrchestrator.ts.bak src/app/orchestrators/ImportOrchestrator.ts
  else
    echo "⚠️ ImportOrchestrator.ts bestaat niet"
  fi
  echo

  echo "=== 7. Git audit trail: gebruik van 'static' in geschiedenis ==="
  git log -p -- src/app/orchestrators/ImportOrchestrator.ts | grep -A10 -B10 "static" || echo "(geen historisch static-gebruik gevonden)"
  echo

  echo "=== 8. Architectuur compliance: andere orchestrators zonder static ==="
  ls src/app/orchestrators/*Orchestrator.ts 2>/dev/null | xargs grep -L "static " || echo "(geen orchestrators gevonden of allemaal static)"
  echo

  echo "=== ✅ CONCLUSIE ==="
  echo "Als:"
  echo "  - Geen andere orchestrator is static"
  echo "  - DataManager verwacht instance"
  echo "  - Interface vereist instance"
  echo "  - Tests/typecheck falen bij static"
  echo "→ Dan MOET static VERWIJDERD worden."
  echo
  echo "Alleen als:"
  echo "  - Geen interface"
  echo "  - Geen consumers buiten util-context"
  echo "  - Geen testbare state"
  echo "→ Dan mag static blijven."

} > static.txt 2>&1