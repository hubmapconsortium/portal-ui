import React from 'react';
import { Control } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SelectedItems } from 'js/hooks/useSelectItems';
import Step, { StepDescription } from 'js/shared-styles/surfaces/Step';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import SelectableTemplateGrid from 'js/components/workspaces/SelectableTemplateGrid';
import { TemplatesTypes } from 'js/components/workspaces/types';
import { FormWithTemplates } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import TemplateTagsAutocomplete from 'js/components/workspaces/TemplateTagsAutocomplete';

function ContactPrompt() {
  return (
    <>
      If you have ideas about additional templates to include in the future, please <ContactUsLink /> .
    </>
  );
}

const description = [
  'Templates can be selected for your workspace for potential workflows revolving around data assays, visualization, QA or other purposes. Multiple templates can be selected. If you are unsure of which templates to launch, the “Select All” button selects all templates.',
  <ContactPrompt key="configure-workspace-contact" />,
];

interface TemplateSelectProps<FormType extends FormWithTemplates> {
  title: string;
  stepIndex?: number;
  control: Control<FormType>;
  selectedRecommendedTags: SelectedItems;
  toggleTag: (itemKey: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  templates: TemplatesTypes;
  disabledTemplates?: TemplatesTypes;
}

function TemplateSelectStep<FormType extends FormWithTemplates>({
  title,
  stepIndex,
  control,
  selectedRecommendedTags,
  toggleTag,
  selectedTags,
  setSelectedTags,
  templates,
  disabledTemplates,
}: TemplateSelectProps<FormType>) {
  return (
    <Step title={title} index={stepIndex}>
      <StepDescription blocks={description} />
      <Stack spacing={2} marginTop={3}>
        <Typography sx={{ mt: 2 }} variant="subtitle1">
          Filter workspace templates by tags
        </Typography>
        <TemplateTagsAutocomplete
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          setSelectedTags={setSelectedTags}
          selectedRecommendedTags={selectedRecommendedTags}
        />
        <SelectableTemplateGrid
          templates={templates}
          disabledTemplates={disabledTemplates}
          control={control}
          showJobTooltip={!!stepIndex}
        />
      </Stack>
    </Step>
  );
}

export default TemplateSelectStep;
