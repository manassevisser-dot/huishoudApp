export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Mapping van functies naar hun nieuwe laag-specifieke paden
  const functionToPath = {
    isoDateOnlyToLocalNoon: '@domain/helpers/DateHydrator',
    todayLocalNoon: '@domain/helpers/DateHydrator',
    toISOFromLocal: '@domain/helpers/DateHydrator',
    parseDDMMYYYYtoISO: '@domain/helpers/DateHydrator',
    getISOWeek: '@domain/helpers/DateHydrator',
    calculateAge: '@domain/rules/ageBoundaryRules',
    getAdultMaxISO: '@domain/rules/ageBoundaryRules',
    getChildMinISO: '@domain/rules/ageBoundaryRules',
    getChildMaxISO: '@domain/rules/ageBoundaryRules',
    isDigitsDatePlausible: '@domain/validation/dateValidators',
    formatDate: '@ui/helpers/dateFormatting',
    formatDateISO: '@ui/helpers/dateFormatting',
    getCurrentDateISO: '@app/orchestrators/dateOrchestrator'
  };

  // 1. Zoek naar imports van @utils/date
  const dateImports = root.find(j.ImportDeclaration, {
    source: { value: '@utils/date' }
  });

  if (dateImports.length === 0) return null;

  const pathToFunctions = {};

  // 2. Verzamel welke functies naar welk nieuw pad moeten
  dateImports.forEach(path => {
    path.node.specifiers.forEach(spec => {
      if (spec.type === 'ImportSpecifier') {
        const funcName = spec.imported.name;
        const newPath = functionToPath[funcName];
        
        if (!newPath) {
          throw new Error(`Functie "${funcName}" uit @utils/date staat niet in de mapping!`);
        }

        if (!pathToFunctions[newPath]) {
          pathToFunctions[newPath] = [];
        }
        pathToFunctions[newPath].push(funcName);
      }
    });
  });

  // 3. Verwijder de oude @utils/date import
  dateImports.remove();

  // 4. Maak de nieuwe import-declaraties aan
  const newImportNodes = Object.entries(pathToFunctions).map(([path, funcs]) => {
    return j.importDeclaration(
      funcs.map(func => j.importSpecifier(j.identifier(func))),
      j.stringLiteral(path)
    );
  });

  // 5. Voeg de nieuwe imports toe bovenaan het bestand
  root.get().node.program.body.unshift(...newImportNodes);

  return root.toSource({ quote: 'single' });
}