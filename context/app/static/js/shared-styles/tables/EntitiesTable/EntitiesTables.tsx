import React, { forwardRef, useEffect } from 'react';

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
import Box from '@mui/material/Box';

// Approximate table dimensions used to reserve loading-placeholder height so the panel doesn't
// collapse while its data loads (which would pull content below the table up into view).
const ESTIMATED_ROW_HEIGHT = 48;
const ESTIMATED_HEADER_HEIGHT = 108; // action row (~48) + sticky column header (~60)
const FALLBACK_MAX_HEIGHT = 600;
const MAX_SKELETON_ROWS = 12;

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
  useDefaultQuery?: boolean;
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

interface EntitiesTableTabsProps<Doc extends Entity> extends Pick<
  ReturnType<typeof useTabs>,
  'openTabIndex' | 'handleTabChange'
> {
  entities: EntitiesTabTypes<Doc>[];
  isLoading?: boolean;
  totalHitsCounts?: number[];
}

interface EntitiesTableTabProps<Doc extends Entity> extends EntitiesTabTypes<Doc> {
  totalHitsCount?: number;
  index: number;
  entities: EntitiesTabTypes<Doc>[];
  isLoading?: boolean;
}
function EntitiesTableTabInternal<Doc extends Entity>(
  {
    entityType,
    tabTooltipText,
    totalHitsCount = 0,
    index,
    isLoading,
    entities,
    // Table-only fields from EntitiesTabTypes -- strip so they don't leak
    // onto <Tab>'s DOM via the spread below.
    query: _query,
    columns: _columns,
    expandedContent: _expandedContent,
    estimatedExpandedRowHeight: _estimatedExpandedRowHeight,
    reverseExpandIndicator: _reverseExpandIndicator,
    headerActions: _headerActions,
    initialSortState: _initialSortState,
    ...rest
  }: EntitiesTableTabProps<Doc>,
  ref: React.Ref<HTMLDivElement>,
) {
  const Icon = entityIconMap?.[entityType];
  const hitsIndicator = isLoading ? <Skeleton variant="text" width={16} /> : totalHitsCount;
  const entityLabel = `${entityType}s `;
  const label = (
    <>
      {entityLabel}({hitsIndicator})
    </>
  );

  return (
    <Tab
      ref={ref}
      key={`${entityType}-tab`}
      index={index}
      label={
        tabTooltipText ? (
          <SecondaryBackgroundTooltip title={tabTooltipText}>
            <Box display="contents">{label}</Box>
          </SecondaryBackgroundTooltip>
        ) : (
          label
        )
      }
      icon={Icon ? <SvgIcon component={Icon} sx={{ fontSize: '1.5rem', color: 'primary' }} /> : undefined}
      iconPosition="start"
      isSingleTab={entities.length === 0}
      {...rest}
    />
  );
}

// React doesn't support generic forwardRef, so we need to cast it
const EntitiesTableTab = forwardRef(EntitiesTableTabInternal) as <Doc extends Entity>(
  props: EntitiesTableTabProps<Doc> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement<unknown>;

function EntitiesTablesTabs<Doc extends Entity>({
  openTabIndex,
  handleTabChange,
  entities,
  isLoading,
  totalHitsCounts,
}: EntitiesTableTabsProps<Doc>) {
  return (
    <Tabs value={openTabIndex} onChange={handleTabChange} aria-label="Entities Tables">
      {entities.map((entity, i) => (
        <EntitiesTableTab<Doc>
          key={`${entity.entityType}-tab`}
          index={i}
          totalHitsCount={totalHitsCounts?.[i]}
          entities={entities}
          isLoading={isLoading}
          {...entity}
        />
      ))}
    </Tabs>
  );
}

interface EntitiesTablesBodiesProps<Doc extends Entity>
  extends
    EntitiesTableTabsProps<Doc>,
    Pick<
      EntitiesTablesProps<Doc>,
      | 'emptyAlert'
      | 'onSelectAllChange'
      | 'onSelectChange'
      | 'maxHeight'
      | 'trackingInfo'
      | 'disabledIDs'
      | 'isSelectable'
      | 'useDefaultQuery'
    > {}

function EntitiesTablesBodies<Doc extends Entity>({
  entities,
  openTabIndex,
  emptyAlert,
  isLoading,
  totalHitsCounts,
  useDefaultQuery,
  maxHeight,
  ...restSharedProps
}: EntitiesTablesBodiesProps<Doc>) {
  return (
    <>
      {entities.map(({ query, entityType, ...entityTableProps }, i) => {
        const queryItems = totalHitsCounts?.[i] ?? 0;

        if (isLoading) {
          const cap = maxHeight ?? FALLBACK_MAX_HEIGHT;
          // Reserve the height the loaded table will occupy. When the row count is known (e.g. the
          // count query has resolved), size to it; otherwise hold the full height so slower parent
          // fetches don't leave the panel collapsed and pull content below into the viewport.
          const reservedHeight =
            queryItems > 0 ? Math.min(ESTIMATED_HEADER_HEIGHT + queryItems * ESTIMATED_ROW_HEIGHT, cap) : cap;
          const skeletonRows = Math.min(
            Math.max(Math.round(reservedHeight / ESTIMATED_ROW_HEIGHT), 3),
            MAX_SKELETON_ROWS,
          );

          return (
            <TabPanel key={entityType} value={openTabIndex} index={i}>
              <Stack width="100%" minHeight={reservedHeight} spacing={0.5}>
                {Array.from({ length: skeletonRows }).map((_, idx) => (
                  <Skeleton height={ESTIMATED_ROW_HEIGHT} key={idx} width="100%" />
                ))}
              </Stack>
            </TabPanel>
          );
        }

        if (queryItems === 0) {
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
            <EntityTable
              query={query}
              useDefaultQuery={useDefaultQuery}
              maxHeight={maxHeight}
              {...entityTableProps}
              {...restSharedProps}
            />
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
  useDefaultQuery = true,
  ...rest
}: EntitiesTablesProps<Doc>) {
  const { openTabIndex, handleTabChange } = useTabs(initialTabIndex);

  const { totalHitsCounts, isLoading: isLoadingHitCounts } = useSearchTotalHitsCounts(
    entities.map(({ query }) => query),
    { useDefaultQuery },
  ) as {
    totalHitsCounts: number[];
    isLoading: boolean;
  };
  return (
    <>
      <EntitiesTablesTabs
        entities={entities}
        openTabIndex={openTabIndex}
        handleTabChange={handleTabChange}
        totalHitsCounts={totalHitsCounts}
        isLoading={isLoading || isLoadingHitCounts}
      />
      <EntitiesTablesBodies
        entities={entities}
        openTabIndex={openTabIndex}
        handleTabChange={handleTabChange}
        isLoading={isLoading || isLoadingHitCounts}
        totalHitsCounts={totalHitsCounts}
        useDefaultQuery={useDefaultQuery}
        {...rest}
      />
      {resetSelectionOnTabChange && <TabChangeSelectionHandler openTabIndex={openTabIndex} />}
    </>
  );
}

export default EntitiesTables;
