import React from 'react';
import Grid2 from '@mui/material/Grid2';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Skeleton from '@mui/material/Skeleton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeftRounded';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import Box from '@mui/material/Box';

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

interface SearchableTransferListProps {
  title: React.ReactNode;
  items: string[];
  checked: string[];
  onToggle: (value: string) => () => void;
  onToggleAll: (items: string[]) => () => void;
  numberOfChecked: (items: string[]) => number;
  itemSecondaryDescriptions?: (item: string) => React.ReactNode;
  isLoadingSecondaryDescriptions?: boolean;
}

function SearchableTransferList({
  title,
  items,
  checked,
  onToggle,
  onToggleAll,
  numberOfChecked,
  itemSecondaryDescriptions,
  isLoadingSecondaryDescriptions = false,
}: SearchableTransferListProps) {
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  // Filter items based on search term (search in both name and description)
  const filteredItems = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const searchLower = searchTerm.toLowerCase();
    return items.filter((item) => {
      const itemNameMatch = item.toLowerCase().includes(searchLower);
      const descriptionText = itemSecondaryDescriptions?.(item);
      const descriptionMatch =
        typeof descriptionText === 'string' ? descriptionText.toLowerCase().includes(searchLower) : false;
      return itemNameMatch || descriptionMatch;
    });
  }, [items, searchTerm, itemSecondaryDescriptions]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={onToggleAll(filteredItems)}
            checked={numberOfChecked(filteredItems) === filteredItems.length && filteredItems.length !== 0}
            indeterminate={
              numberOfChecked(filteredItems) !== filteredItems.length && numberOfChecked(filteredItems) !== 0
            }
            disabled={filteredItems.length === 0}
            slotProps={{
              input: { 'aria-label': 'all items selected' },
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(filteredItems)}/${filteredItems.length} selected${searchTerm ? ` (${items.length} total)` : ''}`}
      />
      <Divider />
      <TextField
        size="small"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ m: 2, width: 'calc(100% - 32px)' }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <List
        sx={{
          bgcolor: 'background.paper',
          overflow: 'auto',
          height: 500,
        }}
        dense
        component="div"
        role="list"
      >
        {filteredItems.map((value: string) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton key={value} role="listitem" onClick={onToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  slotProps={{
                    input: { 'aria-labelledby': labelId },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={value}
                secondary={isLoadingSecondaryDescriptions ? <Skeleton /> : itemSecondaryDescriptions?.(value)}
              />
            </ListItemButton>
          );
        })}
        {filteredItems.length === 0 && searchTerm && (
          <ListItemText
            sx={{ px: 2, py: 1, fontStyle: 'italic', color: 'text.secondary' }}
            primary="No items match your search"
          />
        )}
      </List>
    </Card>
  );
}

interface TransferListProps {
  left: string[];
  right: string[];
  setLeft: (left: string[]) => void;
  setRight: (right: string[]) => void;
  itemSecondaryDescriptions?: (item: string) => React.ReactNode;
  isLoadingSecondaryDescriptions?: boolean;
  leftTitle?: React.ReactNode;
  rightTitle?: React.ReactNode;
  moveToLeftTooltip?: string;
  moveToRightTooltip?: string;
}

export default function SelectableTransferList({
  left,
  right,
  setLeft,
  setRight,
  itemSecondaryDescriptions,
  isLoadingSecondaryDescriptions = false,
  leftTitle = 'Available Choices',
  rightTitle = 'Chosen',
  moveToLeftTooltip = 'Move selected to left',
  moveToRightTooltip = 'Move selected to right',
}: TransferListProps) {
  const [checked, setChecked] = React.useState<string[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: string[]) => intersection(checked, items).length;

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  return (
    <Grid2 container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Grid2 size="grow">
        <SearchableTransferList
          title={leftTitle}
          items={left}
          checked={checked}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
          numberOfChecked={numberOfChecked}
          itemSecondaryDescriptions={itemSecondaryDescriptions}
          isLoadingSecondaryDescriptions={isLoadingSecondaryDescriptions}
        />
      </Grid2>
      <Grid2 size={1}>
        <Grid2 container direction="column" sx={{ alignItems: 'center', gap: 1 }}>
          <SecondaryBackgroundTooltip title={moveToRightTooltip}>
            <Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                <KeyboardArrowRightIcon />
              </Button>
            </Box>
          </SecondaryBackgroundTooltip>
          <SecondaryBackgroundTooltip title={moveToLeftTooltip}>
            <Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                <KeyboardArrowLeftIcon />
              </Button>
            </Box>
          </SecondaryBackgroundTooltip>
        </Grid2>
      </Grid2>
      <Grid2 size="grow">
        <SearchableTransferList
          title={rightTitle}
          items={right}
          checked={checked}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
          numberOfChecked={numberOfChecked}
          itemSecondaryDescriptions={itemSecondaryDescriptions}
          isLoadingSecondaryDescriptions={isLoadingSecondaryDescriptions}
        />
      </Grid2>
    </Grid2>
  );
}
