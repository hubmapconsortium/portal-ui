import React, { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { capitalize, useEventCallback } from '@mui/material/utils';

import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useCellTypeOrgans } from 'js/api/scfind/useCellTypeNames';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TableSortLabel from '@mui/material/TableSortLabel';
import Filter from '@mui/icons-material/FilterListRounded';
import Badge from '@mui/material/Badge';
import { CheckIcon } from 'js/shared-styles/icons';
import { ViewDatasetsButton } from '../organ/OrganCellTypes/ViewIndexedDatasetsButton';
import { useCellTypesSearchActions, useCellTypesSearchState } from './CellTypesSearchContext';
import { LineClamp } from 'js/shared-styles/text';

const desktopConfig = {
  name: {
    flexBasis: '20%',
    flexGrow: 1,
    flexShrink: 0,
  },
  description: {
    flexBasis: '40%',
    flexShrink: 0,
    flexGrow: 1,
  },
  organs: {
    flexBasis: '15%',
    flexShrink: 0,
    flexGrow: 0,
  },
  datasets: {
    flexBasis: 'fit-content',
    flexShrink: 0,
    flexGrow: 0,
  },
};

function CellTypesHeaderPanel() {
  const isMobile = useIsMobile();
  const { sortState, organIsSelected, organs: organsState } = useCellTypesSearchState();
  const { setSort, deselectAllOrgans, selectAllOrgans, toggleOrgan } = useCellTypesSearchActions();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useEventCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  });
  const handleClose = useEventCallback(() => {
    setAnchorEl(null);
  });

  const organs = useCellTypeOrgans();

  const organSelectionIsNotDefault = organsState.length !== organs.length;

  if (isMobile) {
    return null;
  }
  return (
    <StackTemplate spacing={4}>
      <HeaderCell {...desktopConfig.name}>
        <TableSortLabel
          active={sortState.columnId === 'name'}
          direction={sortState.direction}
          onClick={() => {
            setSort('name');
          }}
          sx={{ width: '100%' }}
          data-testid="cell-types-header-name"
        >
          Cell Type
        </TableSortLabel>
      </HeaderCell>
      <HeaderCell {...desktopConfig.description}>Description</HeaderCell>
      <HeaderCell {...desktopConfig.organs}>
        <Button
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            color: 'inherit',
            justifyContent: 'flex-start',
            minWidth: 'auto',
            p: 0,
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
          data-testid="cell-types-header-organs"
          endIcon={
            <Badge badgeContent={organSelectionIsNotDefault ? organsState.length : null} color="success">
              <Filter />
            </Badge>
          }
        >
          Organs
        </Button>
        <Menu
          id="organ-filters-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'organ-filters-button',
            },
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
          <MenuItem onClick={selectAllOrgans} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ListItemText>Select All Organs</ListItemText>
          </MenuItem>
          <Divider />
          {organs.map((organ) => {
            const isSelected = organIsSelected(organ);
            return (
              <MenuItem
                key={organ}
                onClick={() => {
                  toggleOrgan(organ);
                }}
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

interface CellTypePanelItemProps {
  name: string;
  href?: string;
  clid?: string;
  organs: string[];
  description?: string;
}

function OrgansCell({ organs }: { organs: string[] }) {
  const { organIsSelected, filterIsInactive } = useCellTypesSearchState();

  const sortedOrgans = useMemo(() => {
    return organs.sort((a, b) => {
      const aIsSelected = organIsSelected(a);
      const bIsSelected = organIsSelected(b);
      if (filterIsInactive || (aIsSelected && bIsSelected)) {
        return a.localeCompare(b);
      }
      if (aIsSelected && !bIsSelected) return -1; // a is selected, b is not
      if (!aIsSelected && bIsSelected) return 1; // b is selected, a is not
      return a.localeCompare(b); // both are either selected or not, sort alphabetically
    });
  }, [organs, organIsSelected, filterIsInactive]);

  return (
    <>
      {sortedOrgans.map((organ, idx) => {
        return (
          <React.Fragment key={organ}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                color: organIsSelected(organ) || filterIsInactive ? 'text.primary' : 'text.disabled',
              }}
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

function CellTypesPanelItem({ name, href, organs, clid, description }: CellTypePanelItemProps) {
  // New index version does not lowercase the organ names
  const cellTypes = organs.map((o) => `${o}.${name}`);

  return (
    <StackTemplate>
      <BodyCell {...desktopConfig.name} aria-label="Cell Type">
        <Box>
          <InternalLink href={href} display="inline">
            {name}
          </InternalLink>
          {clid && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'text.secondary',
                fontSize: '0.75rem',
                mt: 0.25,
              }}
            >
              {clid}
            </Typography>
          )}
        </Box>
      </BodyCell>
      <BodyCell {...desktopConfig.description} aria-label="Description">
        <LineClamp color="text.secondary" lines={2}>
          {description || 'No description available.'}
        </LineClamp>
      </BodyCell>
      <BodyCell {...desktopConfig.organs} aria-label={organs.length === 1 ? 'Organ' : 'Organs'}>
        <OrgansCell organs={organs} />
      </BodyCell>
      <BodyCell {...desktopConfig.datasets} aria-label="Datasets">
        <SecondaryBackgroundTooltip title={`View datasets containing ${name}.`}>
          <ViewDatasetsButton scFindParams={{ cellTypes }} />
        </SecondaryBackgroundTooltip>
      </BodyCell>
    </StackTemplate>
  );
}

const CellTypesPanel = {
  Header: CellTypesHeaderPanel,
  Item: CellTypesPanelItem,
};

export default CellTypesPanel;
