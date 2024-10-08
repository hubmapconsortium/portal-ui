import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import MultiAutocomplete from 'js/shared-styles/inputs/MultiAutocomplete';
import { SelectedItems } from 'js/hooks/useSelectItems';
import { RECOMMENDED_TAGS } from 'js/components/workspaces/constants';
import { useWorkspaceTemplateTags } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventInfo } from 'js/components/workspaces/types';

interface TemplateTagsAutocompleteProps {
  selectedTags: string[];
  toggleTag: (itemKey: string) => void;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRecommendedTags: SelectedItems;
  trackingInfo: WorkspacesEventInfo;
}

export interface TagTypes extends ChipProps {
  option: string;
}

function TagComponent({ option, ...rest }: TagTypes) {
  return <Chip label={option} {...rest} />;
}

function TemplateTagsAutocomplete({
  selectedTags,
  toggleTag,
  setSelectedTags,
  selectedRecommendedTags,
  trackingInfo,
}: TemplateTagsAutocompleteProps) {
  const { tags } = useWorkspaceTemplateTags();

  return (
    <Stack spacing={1}>
      <MultiAutocomplete
        value={selectedTags}
        options={Object.keys(tags)
          .filter((tag) => !RECOMMENDED_TAGS.includes(tag))
          .sort((a, b) => a.localeCompare(b))}
        multiple
        filterSelectedOptions
        isOptionEqualToValue={(option, value) => option === value}
        tagComponent={TagComponent}
        onChange={(_, value: string[]) => {
          const addedValue = value.find((tag) => !selectedTags.includes(tag));

          if (addedValue) {
            trackEvent({
              ...trackingInfo,
              action: 'Select Template Tag from Dropdown',
              label: addedValue,
            });
          }

          setSelectedTags(value);
        }}
        renderInputProps={{
          variant: 'outlined',
          label: 'Workspace Template Tags',
          placeholder: 'Select tags to filter workspace templates',
        }}
      />
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Recommended Tags
        </Typography>
        <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
          {RECOMMENDED_TAGS.map((tag) => (
            <SelectableChip
              isSelected={selectedRecommendedTags.has(tag)}
              label={tag}
              onClick={() => {
                trackEvent({
                  ...trackingInfo,
                  action: 'Select Recommended Template Tag',
                  label: tag,
                });
                toggleTag(tag);
              }}
              key={tag}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

export default TemplateTagsAutocomplete;
