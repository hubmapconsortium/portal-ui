import React from 'react';
import Grid from '@mui/material/Grid';
import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';

import { TemplateTypes } from '../NewWorkspaceDialog/hooks';

interface Props {
  templates: TemplateTypes[];
  selectedTemplates: Set<string>;
  toggleTemplate: (templateKey: string) => void;
}

function TemplateGrid({ templates, selectedTemplates, toggleTemplate }: Props) {
  return (
    <Grid container spacing={1} alignItems="stretch">
      {Object.entries(templates).map(([templateKey, { title, description, tags }]) => (
        <Grid item xs={4}>
          <SelectableCard
            title={title}
            description={description}
            tags={tags}
            isSelected={selectedTemplates.has(templateKey)}
            selectItem={toggleTemplate}
            cardKey={templateKey}
            sx={{ height: '100%', minHeight: 225 }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default TemplateGrid;
