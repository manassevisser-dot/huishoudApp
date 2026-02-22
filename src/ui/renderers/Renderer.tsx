/**
 * @file_intent Fungeert als dynamische render-bridge voor renderklare ViewModels.
 * @repo_architecture UI Layer - Dynamic Renderer / View-ViewModel Bridge.
 * @term_definition
 *   - `RenderEntryVM`: Renderklaar entry-model met root `primitiveType`.
 *   - `PrimitiveRenderable`: Minimaal object met `primitiveType` voor primitive fallback.
 * @contract De renderer accepteert renderklare modellen en gebruikt geen unsafe casts.
 */
import React from 'react';
import { useMaster } from '@ui/providers/MasterProvider';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import { DynamicEntry } from '@ui/entries/entries';
import { DynamicPrimitive } from '@ui/primitives/primitives';

interface PrimitiveRenderable {
  primitiveType: string;
  props?: Record<string, unknown>;
}

interface RendererProps {
  viewModel: RenderEntryVM | PrimitiveRenderable;
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> => (
  value !== null && typeof value === 'object'
);

const isRenderEntryVM = (value: unknown): value is RenderEntryVM => {
  if (!isObjectRecord(value)) {
    return false;
  }

  return (
    typeof value.entryId === 'string'
    && typeof value.fieldId === 'string'
    && typeof value.label === 'string'
    && typeof value.primitiveType === 'string'
    && typeof value.onChange === 'function'
  );
};

const isPrimitiveRenderable = (value: unknown): value is PrimitiveRenderable => {
  if (!isObjectRecord(value)) {
    return false;
  }

  if (typeof value.primitiveType !== 'string') {
    return false;
  }

  if ('props' in value && value.props !== undefined && !isObjectRecord(value.props)) {
    return false;
  }

  return true;
};

export const Renderer: React.FC<RendererProps> = ({ viewModel }) => {
  useMaster();

  if (isRenderEntryVM(viewModel)) {
    return <DynamicEntry entry={viewModel} />;
  }

  if (isPrimitiveRenderable(viewModel)) {
    return (
      <DynamicPrimitive
        primitiveType={viewModel.primitiveType}
        props={viewModel.props ?? {}}
      />
    );
  }

  return null;
};
