import React from 'react';
import { Control } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';

import { SelectedItems } from 'js/hooks/useSelectItems';
import Step, { StepDescription } from 'js/shared-styles/surfaces/Step';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import MultiAutocomplete from 'js/shared-styles/inputs/MultiAutocomplete';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import SelectableTemplateGrid from '../SelectableTemplateGrid';
import { TemplateTags, TemplatesTypes } from '../types';
import { FormWithTemplates } from '../NewWorkspaceDialog/useCreateWorkspaceForm';

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

interface TagTypes extends ChipProps {
  option: string;
}

function TagComponent({ option, ...rest }: TagTypes) {
  return <Chip label={option} {...rest} />;
}

const recommendedTags = ['visualization', 'api'];

interface TemplateSelectProps<FormType extends FormWithTemplates> {
  title: string;
  stepIndex?: number;
  control: Control<FormType>;
  selectedRecommendedTags: SelectedItems;
  toggleTag: (itemKey: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  tags: TemplateTags;
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
  tags,
  templates,
  disabledTemplates,
}: TemplateSelectProps<FormType>) {
  return (
    <Step title={title} index={stepIndex}>
      <StepDescription blocks={description} />
      <Typography sx={{ mt: 2 }} variant="subtitle1">
        Filter workspace templates by tags
      </Typography>
      <Stack spacing={1}>
        <MultiAutocomplete
          value={selectedTags}
          options={Object.keys(tags)
            .filter((tag) => !recommendedTags.includes(tag))
            .sort((a, b) => a.localeCompare(b))}
          multiple
          filterSelectedOptions
          isOptionEqualToValue={(option, value) => option === value}
          tagComponent={TagComponent}
          onChange={(_, value: string[]) => {
            setSelectedTags(value);
          }}
        />
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Recommended Tags
          </Typography>
          <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
            {recommendedTags.map((tag) => (
              <SelectableChip
                isSelected={selectedRecommendedTags.has(tag)}
                label={tag}
                onClick={() => toggleTag(tag)}
                key={tag}
              />
            ))}
          </Stack>
        </Box>
        <SelectableTemplateGrid templates={templates} disabledTemplates={disabledTemplates} control={control} />
      </Stack>
    </Step>
  );
}

export default TemplateSelectStep;
