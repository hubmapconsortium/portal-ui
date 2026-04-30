import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';

import { SearchIcon, VisualizationIcon } from 'js/shared-styles/icons';

import { SearchMode, useSearchMode } from '../useSearchMode';

import { Tabs, Tab } from './styles';

const MODES: SearchMode[] = ['filter', 'say-see'];

function modeToIndex(mode: SearchMode): number {
  return MODES.indexOf(mode);
}

function indexToMode(index: number): SearchMode {
  return MODES[index] ?? 'filter';
}

function TabLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <span>{text}</span>
    </Stack>
  );
}

function SearchModeTabs() {
  const [mode, setMode] = useSearchMode();

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newIndex: number) => {
      void setMode(indexToMode(newIndex));
    },
    [setMode],
  );

  return (
    <Tabs value={modeToIndex(mode)} onChange={handleChange} aria-label="Search mode">
      <Tab index={0} label={<TabLabel icon={<SearchIcon />} text="Filter & Browse Mode" />} />
      <Tab index={1} label={<TabLabel icon={<VisualizationIcon />} text="Say & See Mode (BETA)" />} />
    </Tabs>
  );
}

export default SearchModeTabs;
