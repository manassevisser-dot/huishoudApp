// src/domain/registry/BaseRegistry.ts
/**
 * @file_intent Generiek contract (interface) voor alle registries in de domeinlaag.
 * @repo_architecture Mobile Industry (MI) - Garandeert consistente toegang tot configuratiedata.
 * @term_definition TKey = De unieke identificatie (bijv. fieldId). TDefinition = De configuratie-objecten (bijv. EntryDefinition).
 * @contract Dwingt af dat elke registry methodes heeft voor validatie, ophalen en opsomming van data.
 * @ai_instruction Gebruik TKey voor de technische koppeling (Data/Field) en TDefinition voor de representatie (UI/Entry).
 */

/**
 * BASE REGISTRY (Domain) — CONTRACT
 * Een generiek contract voor alle registries in de applicatie.
 * * TKey: De toegestane string-keys (bijv. PrimitiveType of fieldId)
 * TDefinition: Wat er achter die key zit (bijv. PrimitiveMetadata of EntryDefinition)
 */
export interface IBaseRegistry<TKey extends string, TDefinition> {
  /**
   * Retourneert de definitie. 
   * @note We gebruiken undefined voor 'niet gevonden' conform de linter-voorkeur in de EntryRegistry.
   */
  getDefinition(key: TKey): TDefinition | null;
  isValidKey(key: string): key is TKey;  
  getAllKeys(): TKey[];
}