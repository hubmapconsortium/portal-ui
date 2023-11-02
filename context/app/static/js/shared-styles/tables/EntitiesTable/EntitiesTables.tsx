import React, { useState } from 'react';

import { Tab } from 'js/shared-styles/tabs';
import { useSearchTotalHitsCounts } from 'js/hooks/useSearchData';
import EntityTable from './EntityTable';
import { EntitiesTabTypes } from './types';
import { StyledTabs, StyledTabPanel } from './style';

interface EntitiesTablesProps<Doc> {
  isSelectable?: boolean;
  initialTabIndex?: number;
  entities: EntitiesTabTypes<Doc>[];
}

const singleTabProps = {
  'aria-disabled': true,
  disableRipple: true,
  sx: { cursor: 'default' },
};

function EntitiesTables<Doc>({ isSelectable = true, initialTabIndex = 0, entities }: EntitiesTablesProps<Doc>) {
  const [openTabIndex, setOpenTabIndex] = useState(initialTabIndex);
  const { totalHitsCounts } = useSearchTotalHitsCounts(entities.map(({ query }) => query)) as {
    totalHitsCounts: number[];
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTabIndex(newValue);
  };

  return (
    <>
      <StyledTabs value={openTabIndex} onChange={handleTabChange} aria-label="Entities Tables">
        {entities.map(({ entityTypeLabel }, i) => {
          return (
            <Tab
              label={`${entityTypeLabel}s (${totalHitsCounts[i] ?? 0})`}
              index={i}
              key={`${entityTypeLabel}-tab`}
              {...(entities.length === 1 && singleTabProps)}
            />
          );
        })}
      </StyledTabs>
      {entities.map(({ query, columns, entityTypeLabel }, i) => (
        <StyledTabPanel value={openTabIndex} index={i} key={`${entityTypeLabel}-table`}>
          <EntityTable<Doc> query={query} columns={columns} isSelectable={isSelectable} />
        </StyledTabPanel>
      ))}
    </>
  );
}

export default EntitiesTables;
