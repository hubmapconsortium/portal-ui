import React, { ChangeEvent } from 'react';
import Grid from '@mui/material/Grid';

import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';
import { TemplatesTypes } from '../types';

interface TemplateGridProps {
  templates: TemplatesTypes;
  selectItem?: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedTemplates?: Set<string>;
  disabledTemplates?: TemplatesTypes;
}

function TemplateGrid({
  templates,
  selectItem,
  selectedTemplates = new Set([]),
  disabledTemplates = {},
}: TemplateGridProps) {
  return (
    <Grid container spacing={2} alignItems="stretch" sx={{ maxHeight: '625px', overflowY: 'auto' }}>
      {Object.entries(templates).map(([templateKey, { title, description, tags }]) => (
        <Grid item md={4} xs={12} key={templateKey}>
          <SelectableCard
            title={title}
            description={description}
            tags={tags}
            isSelected={selectedTemplates.has(templateKey) || templateKey in disabledTemplates}
            selectItem={selectItem}
            cardKey={templateKey}
            sx={{ height: '100%', minHeight: 225 }}
            key={templateKey}
            disabled={templateKey in disabledTemplates}
            tooltip={templateKey in disabledTemplates ? 'This template is already in your workspace.' : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default TemplateGrid;
