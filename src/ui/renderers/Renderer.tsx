/**
 * @file_intent Fungeert als de centrale, dynamische render-engine voor de applicatie. Het component neemt een `viewModel`-object en rendert het bijbehorende UI-component door de `primitiveType`-eigenschap te mappen naar een concrete component-implementatie.
 * @repo_architecture UI Layer - Dynamic Renderer / View-ViewModel Bridge. Dit is de kern van de MVVM-architectuur. Het vertaalt de `ViewModels` (die door de `MasterOrchestrator` worden gecreëerd) naar de daadwerkelijke `Views` (React-componenten).
 * @term_definition
 *   - `ViewModel`: Een data-object dat de structuur, data en het type van een UI-element beschrijft (bijv. een invoerveld, een sectie, of een hele pagina).
 *   - `primitiveType`: Een string-property binnen een `ViewModel` die dient als een unieke sleutel. Deze sleutel komt direct overeen met de naam van een exporteerd React-component in de `Sections`, `Entries`, of `Primitives` modules.
 *   - `Renderer`: Dit component zelf, dat de `primitiveType` van een `ViewModel` leest en dynamisch het corresponderende component uit de juiste module selecteert en rendert.
 * @contract De `Renderer` vereist een `viewModel`-prop. Dit `viewModel` moet een `primitiveType` string bevatten die exact overeenkomt met de naam van een component dat is geëxporteerd uit `entries.tsx`, `primitives.tsx`, of `sections.tsx`. Als er geen overeenkomst is, of als de `viewModel` ongeldig is, wordt er `null` gerenderd om de UI niet te breken.
 * @ai_instruction Dit is de render-motor; je hoeft dit bestand zelden aan te passen. Om een nieuw UI-element te maken dat door deze `Renderer` kan worden gebruikt, moet je: 1. Het component bouwen in de juiste map (`/primitives`, `/entries`, of `/sections`). 2. Het component exporteren vanuit het `index`-bestand van die map (`entries.tsx`, etc.). 3. De `MasterOrchestrator` instrueren om een `ViewModel` te genereren met een `primitiveType` die overeenkomt met de naam van je nieuwe component. De `Renderer` zal het dan automatisch oppikken en renderen.
 */
// src/ui/sections/Renderer.tsx
import React from 'react';
import * as Entries from '@ui/entries/entries';
import * as Primitives from '@ui/primitives/primitives';
import * as Sections from '@ui/sections/sections';
// We halen de hele hiërarchie op uit de Provider
import { 
  useMaster, 
  type ScreenViewModel, 
  type SectionViewModel, 
  type EntryViewModel, 
  type PrimitiveViewModel 
} from '@ui/providers/MasterProvider'; 

type EntryModule = typeof Entries;
type PrimitiveModule = typeof Primitives;
type SectionModule = typeof Sections;

// De Renderer accepteert alles wat een 'primitiveType' heeft
type RenderableViewModel = ScreenViewModel | SectionViewModel | EntryViewModel | PrimitiveViewModel;

interface RendererProps {
  viewModel: RenderableViewModel;
}

export const Renderer: React.FC<RendererProps> = ({ viewModel }) => {
  useMaster(); 

  // De linter-safe guard: we checken of het überhaupt renderbaar is
  if (!viewModel || typeof viewModel.primitiveType !== 'string') {
    return null;
  }

  const { primitiveType } = viewModel;

  // 1. SECTIONS (Groepen/Secties)
  // Verwachten vaak een lijst met sub-primitiveen/velden
  if (primitiveType in Sections) {
    const Section = Sections[primitiveType as keyof SectionModule] as React.SectionType<SectionViewModel>;
    return <Section {...(viewModel as SectionViewModel)} />;
  }

  // 2. FIELDS (Inputs met labels en state)
  // Deze hebben de specifieke { viewModel: T } structuur
  if (primitiveType in Entries) {
    const EntrySection = Entries[primitiveType as keyof EntryModule] as React.SectionType<{ viewModel: EntryViewModel }>;
    return <EntrySection viewModel={viewModel as EntryViewModel} />;
  }

  // 3. PRIMITIVES (Presentational)
  if (primitiveType in Primitives) {
    const PrimitiveSection = Primitives[primitiveType as keyof PrimitiveModule] as React.SectionType<PrimitiveViewModel>;
    return <PrimitiveSection {...(viewModel as PrimitiveViewModel)} />;
  }

  return null;
};