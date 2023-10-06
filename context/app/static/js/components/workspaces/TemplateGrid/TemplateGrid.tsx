import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { TemplateTypes } from '../NewWorkspaceDialog/hooks';

interface TemplateGridProps {
  templates: TemplateTypes[];
  selectedTemplates: Set<string>;
  toggleTemplate: (templateKey: string) => void;
  setSelectedTemplates: (templateKeys: string[]) => void;
}

function TemplateGrid({ templates, selectedTemplates, toggleTemplate, setSelectedTemplates }: TemplateGridProps) {
  return (
    <Box>
      <SpacedSectionButtonRow
        leftText={<Typography variant="subtitle1">{selectedTemplates.size} Templates Selected</Typography>}
        buttons={
          <>
            <Button disabled={selectedTemplates.size === 0} sx={{ mr: 1 }} onClick={() => setSelectedTemplates([])}>
              Deselect All
            </Button>
            <Button color="primary" variant="contained" onClick={() => setSelectedTemplates(Object.keys(templates))}>
              Select All
            </Button>
          </>
        }
      />
      <Grid container spacing={1} alignItems="stretch">
        {Object.entries(templates).map(([templateKey, { title, description, tags }]) => (
          <Grid item xs={4} key={templateKey}>
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
    </Box>
  );
}

export default TemplateGrid;
