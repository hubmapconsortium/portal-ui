import React, { useState } from 'react';

import { Tab, Tabs } from 'js/shared-styles/tabs';
import { useSearchTotalHitsCounts } from 'js/hooks/useSearchData';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import EntityTable from './EntityTable';
import { EntitiesTabTypes } from './types';
import { StyledTabPanel } from './style';

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
    isLoading: boolean;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTabIndex(newValue);
  };

  return (
    <>
      <Tabs value={openTabIndex} onChange={handleTabChange} aria-label="Entities Tables">
        {entities.map(({ entityType }, i) => {
          const Icon = entityIconMap?.[entityType];
          return (
            <Tab
              label={`${entityType}s (${totalHitsCounts[i] ?? 0})`}
              index={i}
              key={`${entityType}-tab`}
              icon={Icon ? <Icon sx={{ fontSize: '1.5rem' }} /> : undefined}
              iconPosition="start"
              {...(entities.length === 1 && singleTabProps)}
            />
          );
        })}
      </Tabs>
      {entities.map(({ query, columns, entityType }, i) => (
        <StyledTabPanel value={openTabIndex} index={i} key={`${entityType}-table`}>
          <EntityTable<Doc> query={query} columns={columns} isSelectable={isSelectable} />
        </StyledTabPanel>
      ))}
    </>
  );
}

export default EntitiesTables;
