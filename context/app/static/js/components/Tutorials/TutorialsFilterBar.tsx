import Stack from '@mui/material/Stack';

import { TUTORIAL_CATEGORIES } from './types';

import React from 'react';
import Typography from '@mui/material/Typography';
import { FilterListRounded } from '@mui/icons-material';
import { useTutorialLandingPageSearchActions, useTutorialLandingPageSearchData } from './TutorialLandingPageContext';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';

export default function TutorialsFilterBar() {
  const { filterCategory } = useTutorialLandingPageSearchData();
  const { setFilterCategory } = useTutorialLandingPageSearchActions();
  return (
    <Stack spacing={1} justifyContent="start" alignItems="start">
      <Stack direction="row" gap={1} alignItems="center" useFlexGap>
        <FilterListRounded color="primary" />
        <Typography variant="subtitle1" component="label" htmlFor="tutorial-category-filters">
          Filter by Category
        </Typography>
      </Stack>
      <Stack direction="row" gap={1} useFlexGap id="tutorial-category-filters">
        {TUTORIAL_CATEGORIES.map((category) => {
          const isSelected = filterCategory === category;

          return (
            <SelectableChip
              isSelected={isSelected}
              label={category}
              key={category}
              onClick={() => setFilterCategory(isSelected ? undefined : category)}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
