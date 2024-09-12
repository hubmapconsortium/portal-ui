import React, { ChangeEvent } from 'react';
import Grid from '@mui/material/Grid';
import SelectableCard from 'js/shared-styles/cards/SelectableCard/SelectableCard';
import { InternalLink } from 'js/shared-styles/Links';
import { TemplatesTypes } from '../types';

interface TemplateGridProps {
  templates: TemplatesTypes;
  selectItem?: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedTemplates?: Set<string>;
  disabledTemplates?: TemplatesTypes;
  onClick?: (templateName: string) => void;
}

function TemplateGrid({
  templates,
  selectItem,
  selectedTemplates = new Set([]),
  disabledTemplates = {},
  onClick,
}: TemplateGridProps) {
  return (
    <Grid container alignItems="stretch" sx={{ maxHeight: '625px', overflowY: 'auto' }}>
      {Object.entries(templates).map(([templateKey, { title, description, tags }]) => (
        <Grid item md={4} xs={12} key={templateKey} paddingBottom={2} paddingX={1}>
          <SelectableCard
            title={
              <InternalLink href={`/templates/${templateKey}`} onClick={() => onClick?.(title)}>
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
            tooltip={templateKey in disabledTemplates ? 'This template is already in your workspace.' : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default TemplateGrid;
