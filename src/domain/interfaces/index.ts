/**
 * @file_intent Exporteert alle interfaces uit de `domain/interfaces` map als een enkel, handig toegangspunt. Dit vereenvoudigt import-statements in andere delen van de applicatie.
 * @repo_architecture Domain Layer - Interfaces (Index File).
 * @contract Dit bestand is een 'barrel file'. Het exporteert alle symbolen (in dit geval de `ValueProvider` en `StateWriter` interfaces) uit de andere bestanden in dezelfde directory. Het bevat zelf geen declaraties.
 * @ai_instruction Gebruik dit indexbestand om de domain-interfaces te importeren. Bijvoorbeeld: `import { ValueProvider, StateWriter } from '@/domain/interfaces';`. Dit maakt de code schoner en minder gevoelig voor veranderingen in de bestandsstructuur binnen de `interfaces` map. Voeg een export-statement toe voor elke nieuwe interface die in deze map wordt aangemaakt.
 */
export * from './ValueProvider';
export * from './StateWriter';
