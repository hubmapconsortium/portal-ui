import React, { useEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { capitalize, useEventCallback } from '@mui/material/utils';

import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
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
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import { trackEvent } from 'js/helpers/trackers';
import { useCellTypesSearchActions, useCellTypesSearchState } from './CellTypesSearchContext';
import { useCellTypesLandingDataContext } from './CellTypesLandingDataContext';
import { LineClamp } from 'js/shared-styles/text';
import Stack from '@mui/material/Stack';
import { getSearchURL } from '../organ/utils';

const dataTypeTooltip =
  'Indicates which data types the cell type was detected in: RNAseq (gene expression) or ATACseq ' +
  '(chromatin accessibility). The count is how many datasets include that cell type for that data type.';

// Uniform, compact width for the Data Type chips so RNAseq/ATACseq line up in columns across rows
// without the counts' varying digit-widths misaligning them. Snug enough to fit "ATACseq (###)" at
// the small chip size while keeping the column from overflowing the panel.
const CHIP_WIDTH = '6.5rem';

const desktopConfig = {
  name: {
    flexBasis: '20%',
    flexGrow: 1,
    flexShrink: 0,
  },
  description: {
    flexBasis: '40%',
    // Yield space to the fixed-width Data Type column on narrower viewports rather than overflowing.
    flexShrink: 1,
    flexGrow: 1,
  },
  organs: {
    flexBasis: '15%',
    flexShrink: 0,
    flexGrow: 0,
  },
  dataType: {
    // Fixed width that holds exactly two compact chips (2 * CHIP_WIDTH + gap), so the chips never
    // overflow the panel and the column edge is stable across rows.
    flexBasis: '14rem',
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

  const { organs } = useCellTypesLandingDataContext();

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
      <HeaderCell {...desktopConfig.dataType}>
        <InfoTextTooltip infoIconSize="small" tooltipTitle={dataTypeTooltip}>
          Data Type
        </InfoTextTooltip>
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
  rnaDatasetCount: number;
  atacDatasetCount: number;
}

/**
 * Unified organ list for a cell type (across modalities). Organs the active filter has selected are
 * emphasized; the rest are dimmed (matching the previous per-modality rendering's behavior).
 */
function OrganList({ organs }: { organs: string[] }) {
  const { organIsSelected, filterIsInactive } = useCellTypesSearchState();

  const sortedOrgans = useMemo(
    () =>
      [...organs].sort((a, b) => {
        const aSelected = organIsSelected(a);
        const bSelected = organIsSelected(b);
        if (filterIsInactive || aSelected === bSelected) return a.localeCompare(b);
        return aSelected ? -1 : 1;
      }),
    [organs, organIsSelected, filterIsInactive],
  );

  return (
    <Typography variant="body2" component="div">
      {sortedOrgans.map((organ, idx) => (
        <React.Fragment key={organ}>
          <Typography
            variant="body2"
            component="span"
            sx={{ color: organIsSelected(organ) || filterIsInactive ? 'text.primary' : 'text.disabled' }}
          >
            {capitalize(organ)}
          </Typography>
          {idx < sortedOrgans.length - 1 && (
            <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
              ,{' '}
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Typography>
  );
}

/**
 * Data Type chips: one outlined, clickable chip per modality the cell type was detected in, each
 * linking to that cell type's datasets for that modality and showing the dataset count.
 */
function DataTypeChips({
  name,
  organs,
  rnaDatasetCount,
  atacDatasetCount,
}: {
  name: string;
  organs: string[];
  rnaDatasetCount: number;
  atacDatasetCount: number;
}) {
  const cellTypes = useMemo(() => organs.map((organ) => `${organ}.${name}`), [organs, name]);

  const trackClick = (modality: string) =>
    trackEvent({
      category: 'Cell Type Landing Page',
      action: `View Datasets / ${modality}`,
      label: name,
    });

  // Compact, uniform-width chips packed from the left. Uniform width keeps the RNAseq and ATACseq
  // chips aligned in columns across rows despite the counts' varying digit-widths.
  return (
    <Stack direction="row" spacing={1} flexWrap="nowrap" useFlexGap>
      {rnaDatasetCount > 0 && (
        <Chip
          size="small"
          sx={{ width: CHIP_WIDTH }}
          variant="outlined"
          clickable
          component="a"
          href={getSearchURL({ entityType: 'Dataset', scFindParams: { cellTypes } })}
          label={`RNAseq (${rnaDatasetCount})`}
          onClick={() => trackClick('RNAseq')}
        />
      )}
      {atacDatasetCount > 0 && (
        <Chip
          size="small"
          sx={{ width: CHIP_WIDTH }}
          variant="outlined"
          clickable
          component="a"
          href={getSearchURL({ entityType: 'Dataset', scFindParams: { cellTypes, modality: 'ATAC' } })}
          label={`ATACseq (${atacDatasetCount})`}
          onClick={() => trackClick('ATACseq')}
        />
      )}
    </Stack>
  );
}

/**
 * Cell type description clamped to two lines that expands to its full text on click. Only
 * interactive when there is a real description that actually overflows when clamped (detected the
 * same way as LineClampWithTooltip). `expanded` is owned by the row so it can grow to fit.
 */
function ExpandableDescription({
  description,
  expanded,
  onToggle,
}: {
  description?: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const text = description || 'No description available.';
  const hasDescription = Boolean(description);
  const ref = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element && !expanded) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [text, expanded]);

  const canExpand = hasDescription && (isTruncated || expanded);

  return (
    <LineClamp
      ref={ref}
      color="text.secondary"
      // A large clamp value effectively removes the 2-line clamp when expanded (showing all lines).
      lines={expanded ? 99 : 2}
      role={canExpand ? 'button' : undefined}
      tabIndex={canExpand ? 0 : undefined}
      aria-expanded={canExpand ? expanded : undefined}
      onClick={canExpand ? onToggle : undefined}
      onKeyDown={
        canExpand
          ? (event: React.KeyboardEvent) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onToggle();
              }
            }
          : undefined
      }
      sx={{ cursor: canExpand ? 'pointer' : 'default' }}
    >
      {text}
    </LineClamp>
  );
}

function CellTypesPanelItem({
  name,
  href,
  clid,
  description,
  organs,
  rnaDatasetCount,
  atacDatasetCount,
}: CellTypePanelItemProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  return (
    // Rows are a fixed height by default; when the description is expanded, let the row grow to fit
    // its full text (top-aligning the cells) instead of clipping it.
    <StackTemplate {...(descriptionExpanded ? { height: 'auto', minHeight: 52, alignItems: 'flex-start' } : {})}>
      <BodyCell {...desktopConfig.name} aria-label="Cell Type">
        <Box>
          {href ? (
            <InternalLink href={href} display="inline">
              {name}
            </InternalLink>
          ) : (
            <Typography variant="body2" component="span">
              {name}
            </Typography>
          )}
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
        <ExpandableDescription
          description={description}
          expanded={descriptionExpanded}
          onToggle={() => setDescriptionExpanded((prev) => !prev)}
        />
      </BodyCell>
      <BodyCell {...desktopConfig.organs} aria-label="Organs">
        <OrganList organs={organs} />
      </BodyCell>
      <BodyCell {...desktopConfig.dataType} aria-label="Data Type">
        <DataTypeChips
          name={name}
          organs={organs}
          rnaDatasetCount={rnaDatasetCount}
          atacDatasetCount={atacDatasetCount}
        />
      </BodyCell>
    </StackTemplate>
  );
}

const CellTypesPanel = {
  Header: CellTypesHeaderPanel,
  Item: CellTypesPanelItem,
};

export default CellTypesPanel;
