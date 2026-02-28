/**
 * @file_intent Biedt een generiek `DynamicSection`-component dat een sectie binnen een scherm rendert. Het component is "dynamisch" omdat het zijn layout (bijv. 'collapsible') en inhoud kan aanpassen op basis van de `definition` en `fields` die het via de `ViewModel` ontvangt.
 * @repo_architecture UI Layer - View/Component (Layout). Dit component fungeert als een layout-container voor een groep van gerelateerde velden (`entries`). Het zit hiërarchisch tussen het `UniversalScreen` en de individuele `Entry`-componenten.
 * @term_definition
 *   - `DynamicSection`: Dit component. Het rendert de "romp" van een sectie, zoals de titel en de container.
 *   - `SectionDefinition`: Het configuratie-object voor de sectie, met eigenschappen als `labelToken` (de titel) en `uiModel` (het gedrag, bijv. 'collapsible').
 *   - `fields`: Een array van `EntryViewModels`. Dit zijn de data-objecten voor de individuele velden die binnen deze sectie getoond moeten worden.
 *   - `RenderEntries`: Een conceptueel component (niet daadwerkelijk geïmplementeerd in dit bestand) dat verantwoordelijk is voor het itereren over de `fields`-array en het renderen van elk veld, waarschijnlijk met behulp van de hoofd `Renderer`.
 * @contract `DynamicSection` ontvangt een `definition` en een `fields`-array. Het gebruikt de `definition` om zijn eigen uiterlijk te bepalen (titel, inklapbaarheid). Het is vervolgens verantwoordelijk voor het doorgeven van de `fields` aan een mechanisme dat elk veld rendert.
 * @ai_instruction Je hoeft dit bestand zelden te wijzigen. Het is een generieke container. Om de *inhoud* van een sectie te veranderen, pas je de `fields`-array aan die door de `MasterOrchestrator` wordt gecreëerd. Om een *nieuw type sectie-gedrag* toe te voegen (naast 'collapsible'), zou je hier de logica moeten uitbreiden. **Belangrijk:** Het `RenderEntries`-component dat hier wordt aangeroepen, is niet gedefinieerd, wat duidt op een implementatiefout. De bedoeling is om hier over de `fields`-prop te itereren en voor elk item de `Renderer` aan te roepen.
 */
// src/ui/sections/sections.tsx
import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AnyStyle } from '@ui/styles/PlatformStyles';
import { DynamicEntry } from '@ui/entries/entries';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';


interface CollapsibleWrapperProps {
  children: React.ReactNode;
  title: string;
  style?: AnyStyle;
  titleStyle?: AnyStyle;
}

const CollapsibleWrapper = ({ children, title, style, titleStyle }: CollapsibleWrapperProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={style}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={titleStyle}>{expanded ? '▼ ' : '▶ '}{title}</Text>
      </TouchableOpacity>
      {expanded && children}
    </View>
  );
};

interface DynamicSectionProps {
  sectionId: string;
  title: string;
  layout: string;
  uiModel?: string;
  children: RenderEntryVM[];
  titleStyle?: AnyStyle;
  containerStyle?: AnyStyle;
}

export const DynamicSection = memo(({
  title,
  uiModel,
  children,
  titleStyle,
  containerStyle,
}: DynamicSectionProps) => {
  const hasLabel = typeof title === 'string' && title.length > 0;

  const content = (
    <View>
      {children.map((entry: RenderEntryVM) => {
        return <DynamicEntry key={entry.entryId} entry={entry} />;
      })}
    </View>
  );

  if (uiModel === 'collapsible') {
    return (
      <CollapsibleWrapper title={title} style={containerStyle} titleStyle={titleStyle}>
        {content}
      </CollapsibleWrapper>
    );
  }

  return (
    <View style={containerStyle}>
      {hasLabel && <Text style={titleStyle}>{title}</Text>}
      {content}
    </View>
  );
});
