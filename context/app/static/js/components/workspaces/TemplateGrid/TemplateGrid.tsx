import React, { ChangeEvent } from 'react';
import Grid from '@mui/material/Grid';

import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';
import { R_JOB_TYPE } from 'js/components/workspaces/constants';
import { TemplatesTypes } from '../types';

interface TemplateGridProps {
  templates: TemplatesTypes;
  selectItem?: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedTemplates?: Set<string>;
  disabledTemplates?: TemplatesTypes;
  jobType?: string;
}

function TemplateGrid({
  templates,
  selectItem,
  selectedTemplates = new Set([]),
  disabledTemplates = {},
  jobType,
}: TemplateGridProps) {
  const getTooltip = (templateKey: string, job_types?: string[]) => {
    if (templateKey in disabledTemplates) {
      return 'This template is already in your workspace.';
      // If the template is an R template and the job type is not R
    }
    if (jobType !== R_JOB_TYPE && job_types?.includes(R_JOB_TYPE)) {
      return 'This template is not compatible with your current environment. To avoid potential issues, please ensure that you have selected the correct environment for your workspace.';
    }
    return undefined;
  };

  return (
    <Grid container columnSpacing={2} alignItems="stretch" sx={{ maxHeight: '625px', overflowY: 'auto' }}>
      {Object.entries(templates).map(([templateKey, { title, description, tags, job_types }]) => {
        return (
          <Grid item md={4} xs={12} key={templateKey} paddingBottom={2}>
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
              tooltip={getTooltip(templateKey, job_types)}
              jobTypes={job_types}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default TemplateGrid;
