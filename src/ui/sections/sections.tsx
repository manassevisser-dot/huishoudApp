// src/ui/sections/sections.tsx
import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AnyStyle } from '@ui/styles/PlatformStyles';


const CollapsibleWrapper = ({ children, title, style, titleStyle }: any) => {
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

export const DynamicSection = memo(({ 
  definition, 
  fields, // <--- DIRECT GEINJECTEERD DOOR MASTER/SCREEN
  titleStyle, 
  containerStyle 
}: { definition: SectionDefinition; fields: any[]; titleStyle?: AnyStyle; containerStyle?: AnyStyle }) => {
  const { labelToken, uiModel } = definition;
  const hasLabel = typeof labelToken === 'string' && labelToken.length > 0;
  const content = <RenderEntries fields={fields} />;

  if (uiModel === 'collapsible') {
    return (
      <CollapsibleWrapper title={labelToken} style={containerStyle} titleStyle={titleStyle}>
        {content}
      </CollapsibleWrapper>
    );
  }

  return (
    <View style={containerStyle}>
      {hasLabel && <Text style={titleStyle}>{labelToken}</Text>}
      {content}
    </View>
  );
});