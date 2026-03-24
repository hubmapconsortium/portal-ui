import React, { ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns/format';

import { trackEvent } from 'js/helpers/trackers';
import Divider from '@mui/material/Divider';
import {
  DateValues,
  ExistsValues,
  FiltersType,
  FacetsType,
  HierarchicalTermValues,
  RangeValues,
  TermValues,
  isDateFacet,
  isDateFilter,
  isExistsFilter,
  isExistsFacet,
  isHierarchicalFacet,
  isHierarchicalFilter,
  isRangeFacet,
  isRangeFilter,
  isTermFilter,
  useSearchStore,
  filterHasValues,
} from '../store';
import { useGetFieldLabel, useGetTransformedFieldValue } from '../fieldConfigurations';

function FilterChip({ onDelete, label, ...props }: ChipProps & { onDelete: () => void }) {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const handleDelete = useCallback(() => {
    onDelete();
    trackEvent({
      category: analyticsCategory,
      action: 'Unselect Facet Chip',
      label,
    });
  }, [onDelete, label, analyticsCategory]);

  return (
    <Chip
      variant="outlined"
      color="primary"
      label={label}
      onDelete={handleDelete}
      sx={(theme) => ({
        borderColor: theme.palette.primary.main,
      })}
      {...props}
    />
  );
}

interface MultiValueFilterChipProps {
  field: string;
  values: string[];
  onDeleteValue: (value: string) => void;
  onDeleteValues: (value: string[]) => void;
}

function MultiValueFilterChip({ field, values, onDeleteValue, onDeleteValues }: MultiValueFilterChipProps) {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);
  const getFieldLabel = useGetFieldLabel();
  const getTransformedFieldValue = useGetTransformedFieldValue();
  const anchorEl = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const fieldLabel = getFieldLabel(field);
  const chipLabel =
    values.length === 1 ? `${fieldLabel}: ${getTransformedFieldValue({ field, value: values[0] })}` : fieldLabel;

  const handleChipClick = useCallback(() => {
    if (values.length > 1) {
      setMenuOpen(true);
    }
  }, [values.length]);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleDeleteValue = useCallback(
    (value: string) => {
      onDeleteValue(value);
      trackEvent({
        category: analyticsCategory,
        action: 'Unselect Facet Chip',
        label: `${fieldLabel}: ${getTransformedFieldValue({ field, value })}`,
      });
      // Close menu if this was the last value
      if (values.length === 1) {
        setMenuOpen(false);
      }
    },
    [onDeleteValue, analyticsCategory, fieldLabel, field, getTransformedFieldValue, values.length],
  );

  const handleDeleteAll = useCallback(() => {
    onDeleteValues(values);
    trackEvent({
      category: analyticsCategory,
      action: 'Unselect Facet Chip',
      label: chipLabel,
    });
    setMenuOpen(false);
  }, [onDeleteValues, values, analyticsCategory, chipLabel]);

  return (
    <>
      <div ref={anchorEl}>
        <Chip
          variant="outlined"
          color="primary"
          label={chipLabel}
          onClick={handleChipClick}
          deleteIcon={
            <ExpandMoreIcon
              sx={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s cubic-bezier' }}
            />
          }
          onDelete={handleChipClick}
          sx={(theme) => ({
            borderColor: theme.palette.primary.main,
            cursor: 'pointer',
          })}
        />
      </div>
      <Menu
        anchorEl={anchorEl.current}
        open={menuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 300,
              width: 'auto',
              minWidth: 200,
            },
          },
        }}
      >
        <MenuItem onClick={handleDeleteAll}>
          <Typography variant="body2" color="error">
            Remove all ({values.length})
          </Typography>
        </MenuItem>
        <Divider />
        {values.map((value) => (
          <MenuItem
            key={value}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 36,
            }}
          >
            <Typography variant="body2" sx={{ flexGrow: 1, pr: 1 }}>
              {getTransformedFieldValue({ field, value })}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteValue(value);
              }}
              sx={{ ml: 1, p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

interface MultiValueHierarchicalFilterChipProps {
  field: string;
  parentValue: string;
  childValues: string[];
  onDeleteChild: (childValue: string) => void;
  onDeleteParent: () => void;
}

function MultiValueHierarchicalFilterChip({
  field,
  parentValue,
  childValues,
  onDeleteChild,
  onDeleteParent,
}: MultiValueHierarchicalFilterChipProps) {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);
  const getFieldLabel = useGetFieldLabel();
  const anchorEl = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const fieldLabel = getFieldLabel(field);
  const chipLabel = childValues.length === 1 ? `${fieldLabel}: ${childValues[0]}` : `${fieldLabel}: ${parentValue}`;

  const handleChipClick = useCallback(() => {
    if (childValues.length > 1) {
      setMenuOpen(true);
    }
  }, [childValues.length]);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleDeleteChild = useCallback(
    (childValue: string) => {
      onDeleteChild(childValue);
      trackEvent({
        category: analyticsCategory,
        action: 'Unselect Facet Chip',
        label: `${fieldLabel}: ${childValue}`,
      });
      // Close menu if this was the last child
      if (childValues.length === 1) {
        setMenuOpen(false);
      }
    },
    [onDeleteChild, analyticsCategory, fieldLabel, childValues.length],
  );

  const handleDeleteAll = useCallback(() => {
    onDeleteParent();
    trackEvent({
      category: analyticsCategory,
      action: 'Unselect Facet Chip',
      label: chipLabel,
    });
    setMenuOpen(false);
  }, [onDeleteParent, analyticsCategory, chipLabel]);

  return (
    <>
      <div ref={anchorEl}>
        <Chip
          variant="outlined"
          color="primary"
          label={chipLabel}
          onClick={handleChipClick}
          deleteIcon={
            <ExpandMoreIcon
              sx={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s cubic-bezier' }}
            />
          }
          onDelete={handleChipClick}
          sx={(theme) => ({
            borderColor: theme.palette.primary.main,
            cursor: 'pointer',
          })}
        />
      </div>
      <Menu
        anchorEl={anchorEl.current}
        open={menuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 300,
              width: 'auto',
              minWidth: 200,
            },
          },
        }}
      >
        <MenuItem onClick={handleDeleteAll}>
          <Typography variant="body2" color="error">
            Remove all ({childValues.length})
          </Typography>
        </MenuItem>
        <Divider />
        {childValues.map((childValue) => (
          <MenuItem
            key={childValue}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 36,
            }}
          >
            <Typography variant="body2" sx={{ flexGrow: 1, pr: 1 }}>
              {childValue}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChild(childValue);
              }}
              sx={{ ml: 1, p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

interface HierarchicalChip {
  parentField: string;
  parentValue: string;
  value: string;
}

const HierarchicalParentChip = React.memo(function HierarchicalTermChip({
  parentField,
  parentValue,
  value,
}: HierarchicalChip) {
  const getFieldLabel = useGetFieldLabel();
  const filterHierarchicalParentTerm = useSearchStore((state) => state.filterHierarchicalParentTerm);

  const onDelete = useCallback(() => {
    filterHierarchicalParentTerm({ term: parentField, value: parentValue, childValues: [] });
  }, [parentField, parentValue, filterHierarchicalParentTerm]);

  return <FilterChip label={`${getFieldLabel(parentField)}: ${value}`} key={value} onDelete={onDelete} />;
});

function ResetFiltersButton() {
  const resetFilters = useSearchStore((state) => state.resetFilters);
  return (
    <Box flexShrink={0}>
      <Button variant="outlined" onClick={resetFilters}>
        Clear Filters
      </Button>
    </Box>
  );
}

const SINGLE_ROW_HEIGHT = 40;

function useChipElements(filters: FiltersType, facets: FacetsType) {
  const filterTerm = useSearchStore((state) => state.filterTerm);
  const filterTerms = useSearchStore((state) => state.filterTerms);
  const filterRange = useSearchStore((state) => state.filterRange);
  const filterDate = useSearchStore((state) => state.filterDate);
  const filterExists = useSearchStore((state) => state.filterExists);
  const filterHierarchicalParentTerm = useSearchStore((state) => state.filterHierarchicalParentTerm);
  const filterHierarchicalChildTerm = useSearchStore((state) => state.filterHierarchicalChildTerm);
  const getFieldLabel = useGetFieldLabel();
  const getTransformedFieldValue = useGetTransformedFieldValue();

  const chipElements: ReactElement[] = [];

  Object.entries(filters).forEach(
    ([field, v]: [string, RangeValues | HierarchicalTermValues | TermValues | DateValues | ExistsValues]) => {
      if (isTermFilter(v) && v.values.size) {
        const values = Array.from(v.values);
        if (values.length === 1) {
          chipElements.push(
            <FilterChip
              key={field}
              label={`${getFieldLabel(field)}: ${getTransformedFieldValue({ field, value: values[0] })}`}
              onDelete={() => {
                filterTerm({ term: field, value: values[0] });
              }}
            />,
          );
        } else {
          chipElements.push(
            <MultiValueFilterChip
              key={field}
              field={field}
              values={values}
              onDeleteValue={(value) => {
                filterTerm({ term: field, value });
              }}
              onDeleteValues={(vals) => {
                filterTerms({ term: field, values: vals });
              }}
            />,
          );
        }
        return;
      }

      const facetConfig = facets[field];

      if (isRangeFilter(v) && isRangeFacet(facetConfig)) {
        if (v.values.min === undefined && v.values.max === undefined) return;
        chipElements.push(
          <FilterChip
            label={`${getFieldLabel(field)}: ${v.values.min} - ${v.values.max}`}
            key={field}
            onDelete={() => {
              filterRange({ field, min: undefined, max: undefined });
            }}
          />,
        );
        return;
      }

      if (isDateFilter(v) && isDateFacet(facetConfig)) {
        if (!(v.values.min && v.values.max)) return;
        chipElements.push(
          <FilterChip
            label={`${getFieldLabel(field)}: ${format(v.values.min, 'yyyy-MM')} - ${format(v.values.max, 'yyyy-MM')}`}
            key={field}
            onDelete={() => {
              filterDate({ field, min: undefined, max: undefined });
            }}
          />,
        );
        return;
      }

      if (isHierarchicalFilter(v) && isHierarchicalFacet(facetConfig)) {
        const parentValues = Object.entries(v.values);
        if (!parentValues.length) return;
        parentValues.forEach(([parent, children]) => {
          if (!children?.size) {
            chipElements.push(
              <HierarchicalParentChip key={parent} parentField={field} value={parent} parentValue={parent} />,
            );
            return;
          }
          const childValues = Array.from(children);
          if (childValues.length === 1) {
            chipElements.push(
              <FilterChip
                key={childValues[0]}
                label={`${getFieldLabel(field)}: ${childValues[0]}`}
                onDelete={() => {
                  filterHierarchicalChildTerm({ parentTerm: field, parentValue: parent, value: childValues[0] });
                }}
              />,
            );
          } else {
            chipElements.push(
              <MultiValueHierarchicalFilterChip
                key={parent}
                field={field}
                parentValue={parent}
                childValues={childValues}
                onDeleteChild={(childValue) => {
                  filterHierarchicalChildTerm({ parentTerm: field, parentValue: parent, value: childValue });
                }}
                onDeleteParent={() => {
                  filterHierarchicalParentTerm({ term: field, value: parent, childValues: [] });
                }}
              />,
            );
          }
        });
        return;
      }

      const hasValues = filterHasValues({ filter: v });
      if (isExistsFilter(v) && isExistsFacet(facetConfig) && hasValues) {
        chipElements.push(
          <FilterChip
            label={`${getFieldLabel(field)}: ${v.values}`}
            key={field}
            onDelete={() => {
              filterExists({ field });
            }}
          />,
        );
      }
    },
  );

  return chipElements;
}

function FilterChips() {
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);

  const chipElements = useChipElements(filters, facets);
  const hasActiveFilters = chipElements.length > 0;

  const [isExpanded, setIsExpanded] = useState(false);
  const [overflowCount, setOverflowCount] = useState(0);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  const measureOverflow = useCallback(() => {
    if (!chipsContainerRef.current || isExpanded) {
      if (isExpanded) setOverflowCount(0);
      return;
    }
    const container = chipsContainerRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) {
      setOverflowCount(0);
      return;
    }

    const firstTop = children[0].offsetTop;
    const overflowing = children.filter((child) => child.offsetTop > firstTop);
    setOverflowCount(overflowing.length);
  }, [isExpanded]);

  // Measure after each render when filters change
  useLayoutEffect(() => {
    measureOverflow();
  }, [measureOverflow, filters]);

  // Re-measure on window resize
  useEffect(() => {
    if (!chipsContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      measureOverflow();
    });
    observer.observe(chipsContainerRef.current);
    return () => observer.disconnect();
  }, [measureOverflow]);

  // Collapse when all filters are cleared
  useEffect(() => {
    if (!hasActiveFilters) {
      setIsExpanded(false);
    }
  }, [hasActiveFilters]);

  if (!hasActiveFilters) {
    return (
      <Typography fontWeight="500" sx={(theme) => ({ color: theme.palette.grey[500], px: 1, py: 0.75 })}>
        0 Filters Selected
      </Typography>
    );
  }

  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start" sx={{ width: '100%' }}>
      <Box
        ref={chipsContainerRef}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          overflow: isExpanded ? 'visible' : 'hidden',
          maxHeight: isExpanded ? 'none' : SINGLE_ROW_HEIGHT,
          flex: 1,
          minWidth: 0,
        }}
      >
        {chipElements}
      </Box>
      <Stack direction="row" spacing={1} flexShrink={0} alignItems="flex-start">
        {(overflowCount > 0 || isExpanded) && (
          <Chip
            label={isExpanded ? 'See less' : `+ ${overflowCount} more`}
            onClick={() => setIsExpanded((prev) => !prev)}
            variant="outlined"
            data-testid="filter-chips-expand-toggle"
            sx={{ cursor: 'pointer' }}
          />
        )}
        <ResetFiltersButton />
      </Stack>
    </Stack>
  );
}

export default FilterChips;
