import React, { useEffect } from 'react';

import { useTabs } from 'js/shared-styles/tabs';
import { useSearchTotalHitsCounts } from 'js/hooks/useSearchData';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { EventInfo, Entity } from 'js/components/types';

import SvgIcon from '@mui/material/SvgIcon';
import EntityTable from './EntityTable';
import { EntitiesTabTypes } from './types';
import { Tabs, Tab, TabPanel } from '../TableTabs';
import { StyledPaper } from './style';
import { useSelectableTableStore } from '../SelectableTableProvider';

interface EntitiesTablesProps<Doc extends Entity> {
  isSelectable?: boolean;
  numSelected?: number;
  initialTabIndex?: number;
  entities: EntitiesTabTypes<Doc>[];
  disabledIDs?: Set<string>;
  emptyAlert?: React.ReactNode;
  trackingInfo?: EventInfo;
  maxHeight?: number;
  onSelectChange?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  onSelectAllChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetSelectionOnTabChange?: boolean;
}

/**
 * Workaround to reset selected entities after tab change
 */
function TabChangeSelectionHandler({ openTabIndex }: { openTabIndex: number }) {
  const deselectAllRows = useSelectableTableStore((s) => s.deselectAllRows);

  useEffect(() => {
    deselectAllRows();
  }, [deselectAllRows, openTabIndex]);

  return <></>;
}

function EntitiesTables<Doc extends Entity>({
  isSelectable = true,
  numSelected,
  initialTabIndex = 0,
  entities,
  disabledIDs,
  emptyAlert,
  trackingInfo,
  maxHeight,
  onSelectAllChange,
  onSelectChange,
  resetSelectionOnTabChange = false,
}: EntitiesTablesProps<Doc>) {
  const { openTabIndex, handleTabChange } = useTabs(initialTabIndex);

  const { totalHitsCounts } = useSearchTotalHitsCounts(entities.map(({ query }) => query)) as {
    totalHitsCounts: number[];
    isLoading: boolean;
  };

  const tableIsEmpty = entities[openTabIndex].query.query?.ids?.values?.length === 0;

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
              icon={Icon ? <SvgIcon component={Icon} sx={{ fontSize: '1.5rem', color: 'primary' }} /> : undefined}
              iconPosition="start"
              isSingleTab={entities.length === 0}
            />
          );
        })}
      </Tabs>
      {tableIsEmpty ? (
        <StyledPaper sx={{ padding: '1rem' }}>{emptyAlert}</StyledPaper>
      ) : (
        entities.map(
          (
            {
              query,
              columns,
              entityType,
              expandedContent,
              estimatedExpandedRowHeight,
              reverseExpandIndicator,
              headerActions,
            },
            i,
          ) => (
            <TabPanel value={openTabIndex} index={i} key={`${entityType}-table`}>
              <EntityTable
                query={query}
                columns={columns}
                isSelectable={isSelectable}
                numSelected={numSelected}
                disabledIDs={disabledIDs}
                trackingInfo={trackingInfo}
                expandedContent={expandedContent}
                maxHeight={maxHeight}
                onSelectAllChange={onSelectAllChange}
                onSelectChange={onSelectChange}
                estimatedExpandedRowHeight={estimatedExpandedRowHeight}
                reverseExpandIndicator={reverseExpandIndicator}
                headerActions={headerActions}
              />
            </TabPanel>
          ),
        )
      )}
      {resetSelectionOnTabChange && <TabChangeSelectionHandler openTabIndex={openTabIndex} />}
    </>
  );
}

export default EntitiesTables;
