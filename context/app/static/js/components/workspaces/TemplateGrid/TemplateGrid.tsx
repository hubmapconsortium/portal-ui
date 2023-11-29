import React, { ChangeEvent } from 'react';
import Grid from '@mui/material/Grid';

import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';
import { TemplatesTypes } from '../types';

interface TemplateGridProps {
  templates: TemplatesTypes;
  selectItem?: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedTemplates?: Set<string>;
}

function TemplateGrid({ templates, selectItem, selectedTemplates = new Set([]) }: TemplateGridProps) {
  return (
    <Grid container spacing={2} alignItems="stretch">
      {Object.entries(templates).map(([templateKey, { title, description, tags }]) => (
        <Grid item xs={4} key={templateKey}>
          <SelectableCard
            title={title}
            description={description}
            tags={tags}
            isSelected={selectedTemplates.has(templateKey)}
            selectItem={selectItem}
            cardKey={templateKey}
            sx={{ height: '100%', minHeight: 225 }}
            key={templateKey}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default TemplateGrid;
