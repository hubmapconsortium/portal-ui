import React, { ChangeEvent, useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';
import { InternalLink } from 'js/shared-styles/Links';
import { sortTemplates } from 'js/components/workspaces/utils';
import { JUPYTER_LAB_R_JOB_TYPE } from 'js/components/workspaces/constants';
import { TemplatesTypes } from 'js/components/workspaces/types';
import { trackEvent } from 'js/helpers/trackers';
import { useWorkspacesEventContext } from 'js/components/workspaces/contexts';

interface TemplateGridProps {
  templates: TemplatesTypes;
  selectItem?: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedTemplates?: Set<string>;
  disabledTemplates?: TemplatesTypes;
  jobType?: string;
  showJobTooltip?: boolean;
  openLinksInNewTab?: boolean;
}

function TemplateGrid({
  templates,
  selectItem,
  selectedTemplates = new Set([]),
  disabledTemplates = {},
  jobType,
  showJobTooltip,
  openLinksInNewTab,
}: TemplateGridProps) {
  const { currentEventCategory, currentWorkspaceItemId } = useWorkspacesEventContext();

  const getTooltip = (templateKey: string, job_types?: string[]) => {
    if (templateKey in disabledTemplates) {
      return 'This template is already in your workspace.';
    }
    // If the template is an R template and the job type is not R
    if (showJobTooltip && jobType !== JUPYTER_LAB_R_JOB_TYPE && job_types?.includes(JUPYTER_LAB_R_JOB_TYPE)) {
      return 'This template is not compatible with your current environment. To avoid potential issues, please ensure that you have selected the correct environment for your workspace.';
    }
    return undefined;
  };

  const sortedTemplates = useMemo(() => sortTemplates(templates, disabledTemplates), [templates, disabledTemplates]);

  return (
    <Grid container alignItems="stretch" sx={{ maxHeight: '625px', overflowY: 'auto' }}>
      {Object.entries(sortedTemplates).map(([templateKey, { title, description, tags, job_types }]) => (
        <Grid size={{ md: 4, xs: 12 }} key={templateKey} paddingBottom={2} paddingX={1}>
          <SelectableCard
            title={
              <InternalLink
                href={`/templates/${templateKey}`}
                target={openLinksInNewTab ? '_blank' : '_self'}
                onClick={() => {
                  trackEvent({
                    category: currentEventCategory,
                    action: 'Templates / Navigate to Template',
                    label: currentWorkspaceItemId ? `${currentWorkspaceItemId} ${title}` : title,
                  });
                }}
                data-testid="template-card"
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
