import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import MultiAutocomplete from 'js/shared-styles/inputs/MultiAutocomplete';
import { SelectedItems } from 'js/hooks/useSelectItems';
import { trackEvent } from 'js/helpers/trackers';
import { useWorkspaceTemplateTags } from '../NewWorkspaceDialog/hooks';

interface TemplateTagsAutocompleteProps {
  selectedTags: string[];
  recommendedTags: string[];
  toggleTag: (itemKey: string) => void;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRecommendedTags: SelectedItems;
  fromWorkspaceLandingPage?: boolean;
}

export interface TagTypes extends ChipProps {
  option: string;
}

function TagComponent({ option, ...rest }: TagTypes) {
  return <Chip label={option} {...rest} />;
}

function TemplateTagsAutocomplete({
  selectedTags,
  recommendedTags,
  toggleTag,
  setSelectedTags,
  selectedRecommendedTags,
  fromWorkspaceLandingPage,
}: TemplateTagsAutocompleteProps) {
  const { tags } = useWorkspaceTemplateTags();

  return (
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
          const addedValue = value.find((tag) => !selectedTags.includes(tag));

          if (fromWorkspaceLandingPage && addedValue) {
            trackEvent({
              category: 'Workspace Landing Page',
              action: 'Select Template Tag from Dropdown',
              value: addedValue,
            });
          }
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
              onClick={() => {
                if (fromWorkspaceLandingPage) {
                  trackEvent({
                    category: 'Workspace Landing Page',
                    action: 'Select Recommended Template Tag',
                    tag,
                  });
                }
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
