import React, { useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { capitalize, useEventCallback } from '@mui/material/utils';

import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useCellTypeOntologyDetail } from 'js/hooks/useUBKG';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { CheckIcon, DownIcon, UpIcon } from 'js/shared-styles/icons';
import { useCellTypeOrgans } from 'js/api/scfind/useCellTypeNames';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TableSortLabel from '@mui/material/TableSortLabel';
import { ViewDatasetsButton } from '../organ/OrganCellTypes/ViewIndexedDatasetsButton';
import { useIndexedDatasetsForCellType } from '../cell-types/hooks';
import { useCellTypesSearchActions, useCellTypesSearchState } from './CellTypesSearchContext';

const desktopConfig = {
  name: {
    flexBasis: '30%',
    flexGrow: 1,
    flexShrink: 0,
  },
  clid: {
    flexBasis: '20%',
    flexShrink: 0,
    flexGrow: 0,
  },
  organs: {
    flexBasis: '20%',
    flexShrink: 0,
    flexGrow: 0,
  },
  datasets: {
    flexBasis: 'fit-content',
    flexShrink: 0,
    flexGrow: 0,
    pr: 2,
  },
};

function CellTypesHeaderPanel() {
  const isMobile = useIsMobile();
  const { sortState } = useCellTypesSearchState();
  const { setSort } = useCellTypesSearchActions();
  if (isMobile) {
    return null;
  }
  return (
    <StackTemplate spacing={4}>
      <HeaderCell {...desktopConfig.name} pl={3}>
        <TableSortLabel
          active={sortState.columnId === 'name'}
          direction={sortState.direction}
          onClick={() => setSort('name')}
          sx={{ width: '100%' }}
          data-testid="cell-types-header-name"
        >
          Cell Type
        </TableSortLabel>
      </HeaderCell>
      <HeaderCell {...desktopConfig.clid} pl={2}>
        <TableSortLabel
          active={sortState.columnId === 'clid'}
          direction={sortState.direction}
          onClick={() => setSort('clid')}
          sx={{ width: '100%' }}
          data-testid="cell-types-header-clid"
        >
          CLID
        </TableSortLabel>
      </HeaderCell>
      <HeaderCell {...desktopConfig.organs} pl={2}>
        Organs
      </HeaderCell>
      <HeaderCell {...desktopConfig.datasets}>
        {/* Hidden button for layout purposes */}
        <Box visibility="hidden">
          <ViewDatasetsButton scFindParams={{}} isLoading={false} />
        </Box>
      </HeaderCell>
    </StackTemplate>
  );
}

interface CellTypeDescriptionProps {
  clid?: string;
}

function CellTypeDescription({ clid }: CellTypeDescriptionProps) {
  const { data, isLoading } = useCellTypeOntologyDetail(clid);

  if (isLoading) {
    return <Skeleton width="100%" />;
  }

  return (
    <Box sx={{ color: 'text.secondary' }} aria-live="polite">
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
    <TooltipIconButton tooltip={!isExpanded && 'Show description'} aria-label="Show description" onClick={onClick}>
      {isExpanded ? <UpIcon fontSize="small" /> : <DownIcon fontSize="small" />}
    </TooltipIconButton>
  );
}

function MobileCellTypeDescriptionButton({
  isExpanded,
  clid,
  onClick,
}: CellTypeDescriptionButtonProps & CellTypeDescriptionProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <BodyCell aria-label="Description" flexBasis="50%" flexShrink={0} flexGrow={1}>
      {isExpanded ? (
        <CellTypeDescription clid={clid} />
      ) : (
        <Button size="small" onClick={onClick} variant="text">
          Show Description
        </Button>
      )}
    </BodyCell>
  );
}

interface CellTypePanelItemProps {
  name: string;
  href?: string;
  clid?: string;
  organs: string[];
}

function OrgansCell({ organs }: { organs: string[] }) {
  const { organIsSelected } = useCellTypesSearchState();

  const sortedOrgans = useMemo(() => {
    return organs.sort((a, b) => {
      const aIsSelected = organIsSelected(a);
      const bIsSelected = organIsSelected(b);
      if (aIsSelected && !bIsSelected) return -1; // a is selected, b is not
      if (!aIsSelected && bIsSelected) return 1; // b is selected, a is not
      return a.localeCompare(b); // both are either selected or not, sort alphabetically
    });
  }, [organs, organIsSelected]);

  return (
    <>
      {sortedOrgans.map((organ, idx) => {
        return (
          <React.Fragment key={organ}>
            <Typography
              variant="body2"
              sx={{ display: 'inline-block', color: organIsSelected(organ) ? 'text.primary' : 'text.secondary' }}
            >
              {capitalize(organ)}
            </Typography>
            {idx < organs.length - 1 && (
              <Typography variant="body2" sx={{ display: 'inline-block', color: 'text.secondary' }}>
                ,&nbsp;
              </Typography>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

function CellTypesPanelItem({ name, href, organs, clid }: CellTypePanelItemProps) {
  const cellTypes = organs.map((o) => `${o.toLowerCase()}.${name}`);
  const { datasetUUIDs, isLoading: isLoadingDatasets } = useIndexedDatasetsForCellType({
    cellTypes,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useEventCallback(() => {
    setIsExpanded((prev) => !prev);
  });

  const isMobile = useIsMobile();

  const row = (
    <StackTemplate>
      <BodyCell {...desktopConfig.name} aria-label="Cell Type">
        {!isMobile && <CellTypeDescriptionButton isExpanded={isExpanded} onClick={toggleExpanded} />}
        <InternalLink href={href} display="inline">
          {name}
        </InternalLink>
      </BodyCell>
      <BodyCell {...desktopConfig.clid} aria-label="CL ID">
        {clid}
      </BodyCell>
      <BodyCell {...desktopConfig.organs} aria-label={organs.length === 1 ? 'Organ' : 'Organs'}>
        <OrgansCell organs={organs} />
      </BodyCell>
      <BodyCell {...desktopConfig.datasets} aria-label="Datasets">
        <SecondaryBackgroundTooltip
          disabled={!datasetUUIDs || datasetUUIDs.length === 0 || isLoadingDatasets}
          title={`View ${datasetUUIDs.length} datasets containing ${name}.`}
        >
          <ViewDatasetsButton scFindParams={{ cellTypes }} isLoading={isLoadingDatasets} />
        </SecondaryBackgroundTooltip>
      </BodyCell>
      <MobileCellTypeDescriptionButton isExpanded={isExpanded} clid={clid} onClick={toggleExpanded} />
    </StackTemplate>
  );

  if (isMobile) {
    return row;
  }

  return (
    // Including the extra margin ensures that the list doesn't become horizontally scrollable
    <Stack direction="column" width="100%" mr={2}>
      {row}
      {isExpanded && !isMobile && (
        <BodyCell width="100%" p={2} pr={0} aria-label="Description">
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useEventCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  });
  const handleClose = useEventCallback(() => {
    setAnchorEl(null);
  });

  const organs = useCellTypeOrgans();

  const { organIsSelected } = useCellTypesSearchState();
  const { deselectAllOrgans, toggleOrgan } = useCellTypesSearchActions();

  return (
    <>
      <UnroundedFilterChip label="Filter by Organ" isSelected={open} onClick={handleOpen} />
      <Menu
        id="organ-filters-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'organ-filters-button',
        }}
        sx={{
          width: {
            xs: '100%',
            sm: '300px',
          },
        }}
      >
        <MenuItem onClick={deselectAllOrgans} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ListItemText>Deselect All Organs</ListItemText>
        </MenuItem>
        <Divider />
        {organs.map((organ) => {
          const isSelected = organIsSelected(organ);
          return (
            <MenuItem
              key={organ}
              onClick={() => toggleOrgan(organ)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <ListItemIcon>
                <OrganIcon organName={organ} />
              </ListItemIcon>
              <ListItemText>{capitalize(organ)}</ListItemText>
              <Box sx={{ ml: 'auto' }}>
                {isSelected ? <CheckIcon color="primary" /> : <Box sx={{ width: 24, height: 24 }} />}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
      <Box visibility="hidden" width={0} height={0}>
        {/* Prefetch organ icons so they don't have to load on first menu open */}
        {organs.map((organ) => (
          <OrganIcon key={organ} organName={organ} />
        ))}
      </Box>
    </>
  );
}

const CellTypesPanel = {
  Header: CellTypesHeaderPanel,
  Item: CellTypesPanelItem,
  Filters: CellTypesPanelFilters,
};

export default CellTypesPanel;
