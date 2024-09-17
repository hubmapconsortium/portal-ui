import React, { ChangeEvent, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';
import { InternalLink } from 'js/shared-styles/Links';
import { sortTemplates } from 'js/components/workspaces/utils';
import { R_JOB_TYPE } from 'js/components/workspaces/constants';
import { TemplatesTypes, WorkspacesEventInfo } from 'js/components/workspaces/types';
import { trackEvent } from 'js/helpers/trackers';

interface TemplateGridProps {
  templates: TemplatesTypes;
  selectItem?: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedTemplates?: Set<string>;
  disabledTemplates?: TemplatesTypes;
  trackingInfo: WorkspacesEventInfo;
  jobType?: string;
}

function TemplateGrid({
  templates,
  selectItem,
  selectedTemplates = new Set([]),
  disabledTemplates = {},
  trackingInfo,
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

  const sortedTemplates = useMemo(() => sortTemplates(templates, disabledTemplates), [templates, disabledTemplates]);

  return (
    <Grid container alignItems="stretch" sx={{ maxHeight: '625px', overflowY: 'auto' }}>
      {Object.entries(sortedTemplates).map(([templateKey, { title, description, tags, job_types }]) => (
        <Grid item md={4} xs={12} key={templateKey} paddingBottom={2} paddingX={1}>
          <SelectableCard
            title={
              <InternalLink
                href={`/templates/${templateKey}`}
                onClick={() =>
                  trackEvent({
                    ...trackingInfo,
                    action: 'Click template card',
                    label: title,
                  })
                }
              >
                {title}
              </InternalLink>
            }
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
      ))}
    </Grid>
  );
}

export default TemplateGrid;
