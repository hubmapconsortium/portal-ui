import React from 'react';

import { useTabs } from 'js/shared-styles/tabs';
import { useSearchTotalHitsCounts } from 'js/hooks/useSearchData';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';

import EntityTable from './EntityTable';
import { EntitiesTabTypes } from './types';
import { Tabs, Tab, TabPanel } from '../TableTabs';
import { StyledPaper } from './style';

interface EntitiesTablesProps<Doc> {
  isSelectable?: boolean;
  initialTabIndex?: number;
  entities: EntitiesTabTypes<Doc>[];
  disabledIDs?: Set<string>;
  emptyAlert?: React.ReactNode;
}

function EntitiesTables<Doc>({
  isSelectable = true,
  initialTabIndex = 0,
  entities,
  disabledIDs,
  emptyAlert,
}: EntitiesTablesProps<Doc>) {
  const { openTabIndex, handleTabChange } = useTabs(initialTabIndex);

  const { totalHitsCounts } = useSearchTotalHitsCounts(entities.map(({ query }) => query)) as {
    totalHitsCounts: number[];
    isLoading: boolean;
  };

  const tableIsEmpty = entities[0].query.query?.ids?.values?.length === 0;

  return (
    <>
      <Tabs value={openTabIndex} onChange={handleTabChange} aria-label="Entities Tables">
        {entities.map(({ entityType }, i) => {
          const Icon = entityIconMap?.[entityType];
          return (
            <Tab
              label={`${entityType}s (${totalHitsCounts[i] ?? 0})`}
              key={`${entityType}-tab`}
              index={i}
              icon={Icon ? <Icon sx={{ fontSize: '1.5rem', color: 'primary' }} /> : undefined}
              iconPosition="start"
              isSingleTab={entities.length === 0}
            />
          );
        })}
      </Tabs>
      {tableIsEmpty ? (
        <StyledPaper sx={{ padding: '1rem' }}>{emptyAlert}</StyledPaper>
      ) : (
        entities.map(({ query, columns, entityType }, i) => (
          <TabPanel value={openTabIndex} index={i} key={`${entityType}-table`}>
            <EntityTable<Doc> query={query} columns={columns} isSelectable={isSelectable} disabledIDs={disabledIDs} />
          </TabPanel>
        ))
      )}
    </>
  );
}

export default EntitiesTables;
