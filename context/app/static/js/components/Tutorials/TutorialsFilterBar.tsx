import Stack from '@mui/material/Stack';

import { TUTORIAL_CATEGORIES, TutorialCategory } from './types';

import React from 'react';
import Typography from '@mui/material/Typography';
import { FilterListRounded } from '@mui/icons-material';
import {
  useTutorialLandingPageFilterCategories,
  useToggleTutorialLandingPageFilterCategory,
} from './TutorialLandingPageContext';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { useEventCallback } from '@mui/material/utils';

interface FilterChipProps {
  category: TutorialCategory;
  isSelected: boolean;
}
function FilterChip({ category, isSelected }: FilterChipProps) {
  const toggleFilterCategory = useToggleTutorialLandingPageFilterCategory();
  const onClick = useEventCallback(() => {
    toggleFilterCategory(category);
  });
  return <SelectableChip isSelected={isSelected} label={category} onClick={onClick} />;
}

export default function TutorialsFilterBar() {
  const filterCategories = useTutorialLandingPageFilterCategories();

  return (
    <Stack spacing={1} justifyContent="start" alignItems="start">
      <Stack direction="row" gap={1} alignItems="center" useFlexGap>
        <FilterListRounded color="primary" />
        <Typography variant="subtitle1" component="label" htmlFor="tutorial-category-filters">
          Filter by Category
        </Typography>
      </Stack>
      <Stack direction="row" gap={1} useFlexGap id="tutorial-category-filters">
        {TUTORIAL_CATEGORIES.map((category) => (
          <FilterChip key={category} category={category} isSelected={filterCategories.includes(category)} />
        ))}
      </Stack>
    </Stack>
  );
}
