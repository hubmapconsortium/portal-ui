import React, { useState, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEventCallback } from '@mui/material/utils';
import IconButton from '@mui/material/IconButton';

interface ColumnFilterDropdownProps {
  columnId: string;
  columnLabel: string;
  values: { value: string; count: number }[];
  selectedValues: Set<string>;
  isLoading: boolean;
  onToggleValue: (value: string) => void;
  onClearFilter: () => void;
}

function ColumnFilterDropdown({
  columnId,
  columnLabel,
  values,
  selectedValues,
  isLoading,
  onToggleValue,
  onClearFilter,
}: ColumnFilterDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useEventCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  });

  const handleClose = useEventCallback(() => {
    setAnchorEl(null);
  });

  const handleToggleValue = useCallback(
    (value: string) => {
      onToggleValue(value);
    },
    [onToggleValue],
  );

  const handleClearAll = useCallback(() => {
    onClearFilter();
  }, [onClearFilter]);

  const selectedCount = selectedValues.size;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        color="primary"
        sx={{
          minWidth: 'auto',
          textTransform: 'none',
          fontSize: '0.75rem',
          padding: '2px 4px',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        aria-label={`Filter ${columnLabel}`}
        data-testid={`filter-button-${columnId}`}
      >
        <Badge badgeContent={selectedCount > 0 ? selectedCount : null} color="primary">
          <FilterListIcon fontSize="small" />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 400,
              minWidth: 200,
              maxWidth: 300,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.primary">
            Filter by {columnLabel}
          </Typography>
        </Box>
        <Divider />
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <>
            <MenuItem onClick={handleClearAll} disabled={selectedCount === 0}>
              <Typography variant="body2" color="text.secondary">
                Clear all filters {selectedCount > 0 && <>({selectedCount})</>}
              </Typography>
            </MenuItem>
            <Divider />
            {values.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  No values available
                </Typography>
              </MenuItem>
            ) : (
              values.map(({ value, count }) => {
                const isSelected = selectedValues.has(value);
                return (
                  <MenuItem
                    key={value}
                    onClick={() => {
                      handleToggleValue(value);
                    }}
                    dense
                  >
                    <Checkbox checked={isSelected} size="small" sx={{ mr: 1, p: 0 }} tabIndex={-1} disableRipple />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 150,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={value}
                          >
                            {value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, flexShrink: 0 }}>
                            ({count})
                          </Typography>
                        </Box>
                      }
                    />
                  </MenuItem>
                );
              })
            )}
          </>
        )}
      </Menu>
    </>
  );
}

export default ColumnFilterDropdown;
