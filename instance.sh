#!/bin/bash

OUT="staticOrInstance.txt"
echo "STATIC VS INSTANCE ANALYSIS" > $OUT
echo "=========================================" >> $OUT
echo "" >> $OUT

echo "1. STATIC METHODS IN ORCHESTRATORS" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "static " src/app/orchestrators >> $OUT
echo "" >> $OUT

echo "2. CONSTRUCTORS IN ORCHESTRATORS" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "constructor(" src/app/orchestrators >> $OUT
echo "" >> $OUT

echo "3. STATIC METHODS IN MANAGERS" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "static " src/app/orchestrators/managers >> $OUT
echo "" >> $OUT

echo "4. CONSTRUCTORS IN MANAGERS" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "constructor(" src/app/orchestrators/managers >> $OUT
echo "" >> $OUT

echo "5. FILEPICKER USAGE" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "FilePickerAdapter" src >> $OUT
echo "" >> $OUT

echo "6. HOW ORCHESTRATORS ARE INSTANTIATED" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "new .*Orchestrator" src >> $OUT
echo "" >> $OUT

echo "7. HOW MANAGERS ARE INSTANTIATED" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "new .*Manager" src >> $OUT
echo "" >> $OUT

echo "8. DIRECT METHOD CALLS WITHOUT INSTANCE" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "\.get\|\.build\|\.handle\|\.process" src/app/orchestrators | grep -v "new " >> $OUT
echo "" >> $OUT

echo "9. MASTER ORCHESTRATOR STRUCTURE" >> $OUT
echo "----------------------------------------" >> $OUT
sed -n '1,200p' src/app/orchestrators/MasterOrchestrator.ts >> $OUT
echo "" >> $OUT

echo "10. FILEPICKER ADAPTER CONTENT" >> $OUT
echo "----------------------------------------" >> $OUT
sed -n '1,200p' src/adapters/system/FilePickerAdapter.ts >> $OUT
echo "" >> $OUT

echo "11. FILEPICKER TEST CONTENT (IF EXISTS)" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "FilePickerAdapter" src/adapters >> $OUT
echo "" >> $OUT

echo "12. CHECK FOR MIXED STATIC + INSTANCE IN SAME CLASS" >> $OUT
echo "----------------------------------------" >> $OUT
grep -R "class .*" -n src/app/orchestrators | while read line; do
  file=$(echo $line | cut -d: -f1)
  class=$(echo $line | cut -d: -f3-)
  echo "Checking $file" >> $OUT
  grep -n "static " $file >> $OUT
  grep -n "constructor(" $file >> $OUT
done
echo "" >> $OUT

echo "DONE"