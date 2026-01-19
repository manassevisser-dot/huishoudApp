// scripts/codemods/migrate-conditions.js
export default function transformer(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);
  
    let hasChanges = false;
  
    // Vind alle imports van @utils/conditions
    const conditionImports = root.find(j.ImportDeclaration, {
      source: { value: '@utils/conditions' }
    });
  
    if (conditionImports.length === 0) {
      return null; // geen wijzigingen
    }
  
    // Verzamel welke functies worden gebruikt
    const usedSpecifiers = new Set();
    conditionImports.forEach(path => {
      path.node.specifiers.forEach(spec => {
        if (spec.type === 'ImportSpecifier') {
          usedSpecifiers.add(spec.local.name);
        }
      });
    });
  
    // Verwijder oude import
    conditionImports.remove();
  
    // Bouw nieuwe imports
    const newImports = [];
    if (usedSpecifiers.has('evaluateConditions')) {
      // Vervang door nieuwe visibility engine
      newImports.push(
        j.importDeclaration(
          [j.importSpecifier(j.identifier('evaluateVisibilityCondition'))],
          j.stringLiteral('@domain/rules/visibilityRules')
        ),
        j.importDeclaration(
          [j.importSpecifier(j.identifier('FormStateValueProvider'))],
          j.stringLiteral('@app/orchestrators/FormStateValueProvider')
        )
      );
    }
  
    if (newImports.length > 0) {
      // Voeg nieuwe imports toe bovenaan
      const body = root.get().node.program.body;
      let insertIndex = 0;
      while (
        insertIndex < body.length &&
        (body[insertIndex].type === 'ExpressionStatement' && /@ts-ignore|@ts-expect-error/.test(body[insertIndex].expression?.value)) ||
        (body[insertIndex].type === 'ImportDeclaration')
      ) {
        insertIndex++;
      }
      body.splice(insertIndex, 0, ...newImports);
      hasChanges = true;
    }
  
    // Vervang aanroepen van evaluateConditions(...)
    if (usedSpecifiers.has('evaluateConditions')) {
      root.find(j.CallExpression, {
        callee: { name: 'evaluateConditions' }
      }).forEach(callPath => {
        const args = callPath.node.arguments;
        if (args.length === 2) {
          // evaluateConditions(condition, state) → 
          // evaluateVisibilityCondition(condition, new FormStateValueProvider(state))
          callPath.replace(
            j.callExpression(
              j.identifier('evaluateVisibilityCondition'),
              [
                args[0],
                j.newExpression(
                  j.identifier('FormStateValueProvider'),
                  [args[1]]
                )
              ]
            )
          );
          hasChanges = true;
        }
      });
    }
  
    return hasChanges ? root.toSource({ quote: 'single' }) : null;
  }