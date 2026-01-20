import React, { useEffect } from 'react';

import { useTabs } from 'js/shared-styles/tabs';
import { useSearchTotalHitsCounts } from 'js/hooks/useSearchData';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { EventInfo, Entity } from 'js/components/types';

import SvgIcon from '@mui/material/SvgIcon';
import Stack from '@mui/material/Stack';
import EntityTable from './EntityTable';
import { EntitiesTabTypes } from './types';
import { Tabs, Tab, TabPanel } from '../TableTabs';
import { StyledPaper } from './style';
import { useSelectableTableStore } from '../SelectableTableProvider';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import Skeleton from '@mui/material/Skeleton';

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
  isLoading?: boolean;
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

interface EntitiesTableTabsProps<Doc extends Entity>
  extends Pick<ReturnType<typeof useTabs>, 'openTabIndex' | 'handleTabChange'> {
  entities: EntitiesTabTypes<Doc>[];
  isLoading?: boolean;
}

interface EntitiesTableTabProps<Doc extends Entity> extends EntitiesTabTypes<Doc> {
  totalHitsCount: number;
  index: number;
  entities: EntitiesTabTypes<Doc>[];
  isLoading?: boolean;
}

function EntitiesTableTab<Doc extends Entity>({
  entityType,
  tabTooltipText,
  totalHitsCount,
  index,
  isLoading,
  entities,
}: EntitiesTableTabProps<Doc>) {
  const Icon = entityIconMap?.[entityType];
  const hitsIndicator = isLoading ? <Skeleton variant="text" width={16} /> : (totalHitsCount ?? 0);
  const entityLabel = `${entityType}s `;
  const label = (
    <>
      {entityLabel}({hitsIndicator})
    </>
  );

  return (
    <Tab
      key={`${entityType}-tab`}
      index={index}
      label={
        tabTooltipText ? (
          <SecondaryBackgroundTooltip title={tabTooltipText}>
            <span>{label}</span>
          </SecondaryBackgroundTooltip>
        ) : (
          label
        )
      }
      icon={Icon ? <SvgIcon component={Icon} sx={{ fontSize: '1.5rem', color: 'primary' }} /> : undefined}
      iconPosition="start"
      isSingleTab={entities.length === 0}
    />
  );
}

function EntitiesTablesTabs<Doc extends Entity>({
  openTabIndex,
  handleTabChange,
  entities,
  isLoading,
}: EntitiesTableTabsProps<Doc>) {
  const { totalHitsCounts, isLoading: isLoadingHitCounts } = useSearchTotalHitsCounts(
    entities.map(({ query }) => query),
  ) as {
    totalHitsCounts: number[];
    isLoading: boolean;
  };

  return (
    <Tabs value={openTabIndex} onChange={handleTabChange} aria-label="Entities Tables">
      {entities.map((entity, i) => (
        <EntitiesTableTab
          key={`${entity.entityType}-tab`}
          index={i}
          totalHitsCount={totalHitsCounts[i]}
          entities={entities}
          isLoading={isLoading || isLoadingHitCounts}
          {...entity}
        />
      ))}
    </Tabs>
  );
}

interface EntitiesTablesBodiesProps<Doc extends Entity>
  extends EntitiesTableTabsProps<Doc>,
    Pick<
      EntitiesTablesProps<Doc>,
      | 'emptyAlert'
      | 'onSelectAllChange'
      | 'onSelectChange'
      | 'maxHeight'
      | 'trackingInfo'
      | 'disabledIDs'
      | 'isSelectable'
    > {}

function EntitiesTablesBodies<Doc extends Entity>({
  entities,
  openTabIndex,
  emptyAlert,
  isLoading,
  ...restSharedProps
}: EntitiesTablesBodiesProps<Doc>) {
  return (
    <>
      {entities.map(({ query, entityType, ...entityTableProps }, i) => {
        const must = query.query?.bool?.must;
        const idsQuery = Array.isArray(must) ? must.find((item) => item?.ids?.values) : must;
        // The number of query items generally corresponds to the number of items in the "ids" query, if present
        const queryItems = idsQuery?.ids?.values?.length ?? 0;

        const tableIsEmpty = queryItems === 0;

        if (isLoading) {
          const minRows = 3;
          const maxRows = 6;
          const rows = Math.min(Math.max(queryItems, minRows), maxRows);

          return (
            <TabPanel key={entityType} value={openTabIndex} index={i}>
              <Stack width="100%">
                {Array.from({ length: rows }).map((_, idx) => (
                  <Skeleton height={30} key={idx} width="100%" />
                ))}
              </Stack>
            </TabPanel>
          );
        }

        if (tableIsEmpty) {
          return (
            <TabPanel key={entityType} value={openTabIndex} index={i}>
              <StyledPaper key={entityType} sx={{ padding: '1rem', width: '100%' }}>
                {emptyAlert}
              </StyledPaper>
            </TabPanel>
          );
        }

        return (
          <TabPanel key={entityType} value={openTabIndex} index={i}>
            <EntityTable query={query} {...entityTableProps} {...restSharedProps} />
          </TabPanel>
        );
      })}
    </>
  );
}

function EntitiesTables<Doc extends Entity>({
  initialTabIndex = 0,
  entities,
  resetSelectionOnTabChange = false,
  isLoading,
  ...rest
}: EntitiesTablesProps<Doc>) {
  const { openTabIndex, handleTabChange } = useTabs(initialTabIndex);

  return (
    <>
      <EntitiesTablesTabs
        entities={entities}
        openTabIndex={openTabIndex}
        handleTabChange={handleTabChange}
        isLoading={isLoading}
      />
      <EntitiesTablesBodies
        entities={entities}
        openTabIndex={openTabIndex}
        handleTabChange={handleTabChange}
        isLoading={isLoading}
        {...rest}
      />
      {resetSelectionOnTabChange && <TabChangeSelectionHandler openTabIndex={openTabIndex} />}
    </>
  );
}

export default EntitiesTables;
