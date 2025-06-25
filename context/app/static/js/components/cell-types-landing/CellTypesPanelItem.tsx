import React, { useState } from 'react';

import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
import { capitalize, useEventCallback } from '@mui/material/utils';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import Box from '@mui/material/Box';
import { useCellTypeOntologyDetail } from 'js/hooks/useUBKG';
import Skeleton from '@mui/material/Skeleton';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { DownIcon, UpIcon } from 'js/shared-styles/icons';
import { ViewDatasetsButton } from '../organ/OrganCellTypes/ViewIndexedDatasetsButton';
import { useIndexedDatasetsForCellType } from '../cell-types/hooks';

const desktopConfig = {
  name: {
    flexBasis: '30%',
    flexGrow: 1,
    flexShrink: 0,
  },
  organs: {
    flexBasis: '20%',
    flexShrink: 0,
    flexGrow: 0,
  },
  datasets: {
    flexBasis: '20%',
    flexShrink: 0,
    flexGrow: 0,
  },
};

function CellTypesHeaderPanel() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return null;
  }
  return (
    <StackTemplate spacing={4}>
      <HeaderCell {...desktopConfig.name}>Cell Type</HeaderCell>
      <HeaderCell {...desktopConfig.organs}>Organs</HeaderCell>
      <HeaderCell {...desktopConfig.datasets} />
    </StackTemplate>
  );
}

interface CellTypePanelItemProps {
  name: string;
  href?: string;
  clid?: string;
  organs: string[];
}

interface CellTypeDescriptionProps {
  clid?: string;
}

function CellTypeDescription({ clid }: CellTypeDescriptionProps) {
  const { data, isLoading } = useCellTypeOntologyDetail(clid);

  if (isLoading) {
    return <Skeleton sx={{ mx: 2, p: 2, width: '100%' }} />;
  }

  return (
    <Box sx={{ p: 2, color: 'text.secondary' }} aria-live="polite">
      {data?.cell_type?.definition ?? 'No description available.'}
    </Box>
  );
}

interface CellTypeDescriptionButtonProps {
  isExpanded: boolean;
  onClick?: () => void;
}

function CellTypeDescriptionButton({ isExpanded, onClick }: CellTypeDescriptionButtonProps) {
  return (
    <TooltipIconButton
      tooltip={!isExpanded && 'Show description'}
      aria-label="Show description"
      size="small"
      onClick={onClick}
    >
      {isExpanded ? <DownIcon fontSize="small" /> : <UpIcon fontSize="small" />}
    </TooltipIconButton>
  );
}

function CellTypesPanelItem({ name, href, organs, clid }: CellTypePanelItemProps) {
  const { datasetUUIDs, isLoading: isLoadingDatasets } = useIndexedDatasetsForCellType({
    cellTypes: organs.map((o) => `${o.toLowerCase()}.${name}`),
  });
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useEventCallback(() => {
    setIsExpanded((prev) => !prev);
  });

  return (
    <Stack flexDirection="column" width="100%">
      <StackTemplate>
        <BodyCell width="0">
          <CellTypeDescriptionButton isExpanded={isExpanded} onClick={toggleExpanded} />
        </BodyCell>
        <BodyCell {...desktopConfig.name} aria-label="Cell Type">
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={0.5}
            alignItems={isMobile ? 'flex-start' : 'center'}
            flexWrap="nowrap"
          >
            <InternalLink href={href}>{name}</InternalLink>
            <Box>{clid && `(${clid})`}</Box>
          </Stack>
        </BodyCell>
        <BodyCell {...desktopConfig.organs} aria-label={organs.length === 1 ? 'Organ' : 'Organs'}>
          {organs?.map((o) => capitalize(o)).join(', ') || <i>No organ information</i>}
        </BodyCell>
        <BodyCell {...desktopConfig.datasets} aria-label="Datasets">
          <SecondaryBackgroundTooltip
            disabled={!datasetUUIDs || datasetUUIDs.length === 0 || isLoadingDatasets}
            title={`View ${datasetUUIDs.length} datasets containing ${name}.`}
          >
            <Box sx={{ display: 'block', width: 'fit-content' }}>
              <ViewDatasetsButton datasetUUIDs={datasetUUIDs} isLoading={isLoadingDatasets} />
            </Box>
          </SecondaryBackgroundTooltip>
        </BodyCell>
      </StackTemplate>
      {isExpanded && (
        <BodyCell width="100%" aria-label="Cell Type Description">
          <CellTypeDescription clid={clid} />
        </BodyCell>
      )}
    </Stack>
  );
}

const UnroundedFilterChip = styled(SelectableChip)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  '&.MuiChip-outlined': {
    borderRadius: theme.spacing(1),
  },
}));

function CellTypesPanelFilters() {
  return (
    <Stack direction="row" spacing={1}>
      <UnroundedFilterChip label="Filter by Organ" isSelected={false} />
    </Stack>
  );
}

const CellTypesPanel = {
  Header: CellTypesHeaderPanel,
  Item: CellTypesPanelItem,
  Filters: CellTypesPanelFilters,
};

export default CellTypesPanel;
