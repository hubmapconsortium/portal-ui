import React, { ChangeEvent } from 'react';
import Grid from '@mui/material/Grid';

import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';
import { R_JOB_TYPE, R_TEMPLATE_LABEL } from 'js/components/workspaces/constants';
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
    <Grid container columnSpacing={2} alignItems="stretch" sx={{ maxHeight: '625px', overflowY: 'auto' }}>
      {Object.entries(templates).map(([templateKey, { title, description, tags, job_types }]) => {
        const isRTemplate = job_types?.includes(R_JOB_TYPE);
        return (
          <Grid item md={4} xs={12} key={templateKey} paddingBottom={2}>
            <SelectableCard
              title={isRTemplate ? `${title} (${R_TEMPLATE_LABEL})` : title}
              description={description}
              tags={[...tags, ...(isRTemplate ? [R_TEMPLATE_LABEL] : [])]}
              isSelected={selectedTemplates.has(templateKey) || templateKey in disabledTemplates}
              selectItem={selectItem}
              cardKey={templateKey}
              sx={{ height: '100%', minHeight: 225 }}
              key={templateKey}
              disabled={templateKey in disabledTemplates}
              tooltip={templateKey in disabledTemplates ? 'This template is already in your workspace.' : undefined}
              jobTypes={job_types}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default TemplateGrid;
