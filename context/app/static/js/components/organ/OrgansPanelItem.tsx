import React from 'react';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
import { OrganFileWithDescendants } from 'js/components/organ/types';
import { useOrgansSearchState, useOrgansSearchActions } from './OrgansSearchContext';
import Stack from '@mui/material/Stack';
import { useCellTypesOfOrgan, useSearchItems } from 'js/pages/Organ/hooks';
import { getSearchURL } from './utils';
import ViewEntitiesButton from './ViewEntitiesButton';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { CellTypeIcon } from 'js/shared-styles/icons';

const desktopConfig = {
  name: {
    flexBasis: '25%',
    flexShrink: 0,
    flexGrow: 0,
  },
  description: {
    flexBasis: '30%',
    flexGrow: 1,
    flexShrink: 0,
  },
  datasets: {
    flexBasis: '10%',
    flexShrink: 1,
    flexGrow: 0,
  },
  samples: {
    flexBasis: '10%',
    flexShrink: 1,
    flexGrow: 0,
  },
};

function OrgansHeaderPanel() {
  const isMobile = useIsMobile();
  const { sortState } = useOrgansSearchState();
  const { setSort } = useOrgansSearchActions();

  if (isMobile) {
    return null;
  }

  return (
    <StackTemplate spacing={4}>
      <HeaderCell {...desktopConfig.name} pl={4}>
        <TableSortLabel
          active={sortState.columnId === 'name'}
          direction={sortState.direction}
          onClick={() => {
            setSort('name');
          }}
          sx={{ width: '100%' }}
          data-testid="organs-header-name"
        >
          Organ
        </TableSortLabel>
      </HeaderCell>
      <HeaderCell {...desktopConfig.description}>
        <TableSortLabel
          active={sortState.columnId === 'description'}
          direction={sortState.direction}
          onClick={() => {
            setSort('description');
          }}
          sx={{ width: '100%' }}
          data-testid="organs-header-description"
        >
          Description
        </TableSortLabel>
      </HeaderCell>
      <HeaderCell {...desktopConfig.datasets}>
        <TableSortLabel
          active={sortState.columnId === 'datasets'}
          direction={sortState.direction}
          onClick={() => {
            setSort('datasets');
          }}
          sx={{ width: '100%' }}
          data-testid="organs-header-datasets"
        >
          Datasets
        </TableSortLabel>
      </HeaderCell>
      <HeaderCell {...desktopConfig.samples}>
        <TableSortLabel
          active={sortState.columnId === 'samples'}
          direction={sortState.direction}
          onClick={() => {
            setSort('samples');
          }}
          sx={{ width: '100%' }}
          data-testid="organs-header-samples"
        >
          Samples
        </TableSortLabel>
      </HeaderCell>
    </StackTemplate>
  );
}

interface OrganPanelItemProps {
  organ: OrganFileWithDescendants;
  href?: string;
}

function OrgansPanelItem({ organ, href }: OrganPanelItemProps) {
  const { name, uberon_short, description, descendantCounts, icon } = organ;

  const searchItems = useSearchItems(organ);
  const datasetCount = descendantCounts.Dataset || 0;
  const sampleCount = descendantCounts.Sample || 0;

  const isMobile = useIsMobile();

  const cellTypes = useCellTypesOfOrgan(organ.name);

  return (
    <StackTemplate>
      <BodyCell {...desktopConfig.name} aria-label="Organ" hideMobileLabel>
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Using URLSvgIcon here directly instead of OrganIcon to prevent redundant request for icon URL */}
          <URLSvgIcon iconURL={icon} ariaLabel={name} aria-hidden fontSize="small" />
          <Stack direction="column" alignItems="start" spacing={0.25}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <InternalLink href={href} variant="body2" data-testid={`organ-link-${name}`}>
                {name}
              </InternalLink>
              {cellTypes.length > 0 && (
                <SecondaryBackgroundTooltip title="This organ contains datasets with annotated cell types">
                  <CellTypeIcon />
                </SecondaryBackgroundTooltip>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" component="span">
              {uberon_short}
            </Typography>
          </Stack>
        </Stack>
      </BodyCell>
      <BodyCell {...desktopConfig.description} aria-label="Description" hideMobileLabel>
        <Box
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </BodyCell>
      {!isMobile && (
        <>
          <BodyCell {...desktopConfig.datasets} aria-label="Datasets">
            <InternalLink
              variant="body2"
              href={getSearchURL({
                entityType: 'Dataset',
                organTerms: searchItems,
              })}
            >
              {datasetCount.toLocaleString()}
            </InternalLink>
          </BodyCell>
          <BodyCell {...desktopConfig.samples} aria-label="Samples">
            <InternalLink
              variant="body2"
              href={getSearchURL({
                entityType: 'Sample',
                organTerms: searchItems,
              })}
            >
              {sampleCount.toLocaleString()}
            </InternalLink>
          </BodyCell>
        </>
      )}
      {isMobile && (
        <Stack direction="row" spacing={1}>
          <ViewEntitiesButton
            entityType="Dataset"
            count={datasetCount}
            filters={{ organTerms: searchItems }}
            fullWidth
            variant="elevated"
            disabled={datasetCount === 0}
          />
          <ViewEntitiesButton
            entityType="Sample"
            count={sampleCount}
            filters={{ organTerms: searchItems }}
            fullWidth
            variant="elevated"
            disabled={sampleCount === 0}
          />
        </Stack>
      )}
    </StackTemplate>
  );
}

const OrgansPanel = {
  Header: OrgansHeaderPanel,
  Item: OrgansPanelItem,
};

export default OrgansPanel;
