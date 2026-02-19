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