import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Typography from '@mui/material/Typography';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { AggregationsBuckets } from 'js/typings/elasticsearch';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { trackEvent } from 'js/helpers/trackers';
import { useSearch, InnerBucket } from '../Search';
import { isTermFilter, useSearchStore, TermValues, isHierarchicalFilter } from '../store';
import {
  StyledCheckBoxBlankIcon,
  StyledCheckBoxIcon,
  StyledCheckbox,
  StyledFormControlLabel,
  StyledStack,
  FormLabelText,
  HierarchicalAccordionSummary,
  RIGHT_CHEVRON_SIZE,
} from './style';
import FacetAccordion from './FacetAccordion';
import { useGetFieldLabel, useGetTransformedFieldValue } from '../fieldConfigurations';
import { decimal } from 'js/helpers/number-format';

interface CheckboxItem {
  label: string;
  count: number;
  title: string;
  active: boolean;
  onClick: () => void;
  indeterminate?: boolean;
  field: string;
  addRightPadding?: boolean;
}

function getBucketKey(bucket: InnerBucket) {
  const { key, key_as_string } = bucket;
  return key_as_string ?? key;
}

type TermLabelCount = Omit<CheckboxItem, 'field' | 'indeterminate' | 'onClick' | 'title'>;

export function TermLabelAndCount({ label, count, active, addRightPadding }: TermLabelCount) {
  return (
    <StyledStack direction="row" justifyContent="space-between" $active={active}>
      <FormLabelText>{label}</FormLabelText>
      <Typography pr={addRightPadding ? RIGHT_CHEVRON_SIZE : 0}>{decimal.format(count)}</Typography>
    </StyledStack>
  );
}

function CheckboxFilterItem({
  active = false,
  label,
  title,
  count,
  onClick,
  indeterminate = false,
  field,
  addRightPadding,
}: CheckboxItem) {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);
  const getTransformedFieldValue = useGetTransformedFieldValue();
  const handleClick = useCallback(() => {
    onClick();

    const facetAction = active ? 'Unselect' : 'Select';
    trackEvent({
      category: analyticsCategory,
      action: `${facetAction} Facet`,
      label: `${title}: ${label}`,
    });
  }, [active, analyticsCategory, title, label, onClick]);

  return (
    <StyledFormControlLabel
      control={
        <StyledCheckbox
          checked={active}
          indeterminate={indeterminate}
          indeterminateIcon={<IndeterminateCheckBoxOutlinedIcon fontSize="small" />}
          name={`${label}-checkbox`}
          color="primary"
          icon={<StyledCheckBoxBlankIcon />}
          checkedIcon={<StyledCheckBoxIcon />}
          onChange={handleClick}
        />
      }
      label={
        <TermLabelAndCount
          label={getTransformedFieldValue({ value: label, field })}
          count={count}
          active={active}
          addRightPadding={addRightPadding}
        />
      }
    />
  );
}

interface TermFacet extends Omit<CheckboxItem, 'onClick'> {
  field: string;
}

export function TermFacetItem({ label, field, ...rest }: TermFacet) {
  const filterTerm = useSearchStore((state) => state.filterTerm);

  const handleClick = useCallback(() => {
    filterTerm({ term: field, value: label });
  }, [filterTerm, field, label]);

  return <CheckboxFilterItem onClick={handleClick} label={label} field={field} {...rest} addRightPadding />;
}

const smallAggSize = 5;

function FacetSizeButton({ handleExpand, hasMoreBuckets }: { handleExpand: () => void; hasMoreBuckets: boolean }) {
  return (
    <Button
      variant="text"
      onClick={handleExpand}
      size="small"
      sx={(theme) => ({ fontSize: theme.typography.caption.fontSize })}
    >
      {hasMoreBuckets ? 'View More' : 'View Less'}
    </Button>
  );
}

function TermFacetContent({
  filter,
  field,
  isFilterable,
}: {
  filter: TermValues;
  field: string;
  isFilterable?: boolean;
}) {
  const { aggregations } = useSearch();
  const [showLessTerms, setShowLessTerms] = useState(true);
  const [valueFilter, setValueFilter] = useState('');
  const getFieldLabel = useGetFieldLabel();
  const getTransformedFieldValue = useGetTransformedFieldValue();

  const toggleTermsCount = useCallback(() => {
    setShowLessTerms((prev) => !prev);
  }, [setShowLessTerms]);

  const handleValueFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValueFilter(event.target.value);
  }, []);

  const innerAggregations = aggregations?.[field]?.[field];

  if (!(innerAggregations && 'buckets' in innerAggregations)) {
    return null;
  }
  const aggBuckets = innerAggregations?.buckets;

  if (!aggBuckets || !Array.isArray(aggBuckets)) {
    return null;
  }

  // An empty accordion is never useful, so hide a facet with nothing to offer -- but never hide
  // one the user is actively filtering on, which would strand a filter they cannot see to undo.
  // (A facet's own filter is excluded from its aggregation, so a filtered facet normally still
  // has buckets; this only guards the edge case.)
  if (aggBuckets.length === 0 && filter.values.size === 0) {
    return null;
  }

  const title = getFieldLabel(field);

  // Matches the displayed value, which is what the user is reading -- the same choice
  // `FacetSearchCombobox` makes. Selected values always stay visible so a filter can be undone
  // without first clearing the text box.
  const matchingBuckets = valueFilter
    ? aggBuckets.filter((bucket) => {
        const key = getBucketKey(bucket);
        if (filter.values.has(key)) return true;
        return getTransformedFieldValue({ value: key, field }).toLowerCase().includes(valueFilter.toLowerCase());
      })
    : aggBuckets;

  // With a text filter the list is already narrowed, so paging it again just hides matches.
  const visibleBuckets = showLessTerms && !valueFilter ? matchingBuckets.slice(0, smallAggSize) : matchingBuckets;

  return (
    <FacetAccordion title={title} position="inner">
      {isFilterable && aggBuckets.length > smallAggSize && (
        <Box sx={{ px: 1, pb: 1 }}>
          <TextField
            size="small"
            fullWidth
            value={valueFilter}
            onChange={handleValueFilterChange}
            placeholder={`Find ${title.toLowerCase()}`}
            aria-label={`Find a value in ${title}`}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      )}
      {valueFilter && matchingBuckets.length === 0 && (
        <Box sx={{ px: 1, pb: 1 }}>
          <Typography variant="caption" color="secondary">
            No matching values.
          </Typography>
        </Box>
      )}
      {visibleBuckets.map((bucket) => {
        const key = getBucketKey(bucket);
        return (
          <TermFacetItem
            label={key}
            count={bucket.doc_count}
            key={key}
            active={filter.values.has(key)}
            field={field}
            title={title}
          />
        );
      })}
      {!valueFilter && matchingBuckets.length > smallAggSize && (
        <FacetSizeButton hasMoreBuckets={showLessTerms} handleExpand={toggleTermsCount} />
      )}
    </FacetAccordion>
  );
}

export function TermFacet({ field, isFilterable }: { field: string; isFilterable?: boolean }) {
  const filter = useSearchStore((state) => state.filters[field]);

  if (!isTermFilter(filter)) {
    return null;
  }

  return <TermFacetContent field={field} filter={filter} isFilterable={isFilterable} />;
}

function buildExpandTooltip({ expanded, disabled }: { expanded: boolean; disabled: boolean }) {
  if (disabled) {
    return undefined;
  }

  return expanded ? 'View Less' : 'View More';
}

export function HierarchicalFacetParent({ childValues, field, label, ...rest }: TermFacet & { childValues: string[] }) {
  const filterHierarchicalParentTerm = useSearchStore((state) => state.filterHierarchicalParentTerm);

  const f = useCallback(() => {
    filterHierarchicalParentTerm({ term: field, value: label, childValues });
  }, [field, label, childValues, filterHierarchicalParentTerm]);
  return <CheckboxFilterItem onClick={f} label={label} field={field} {...rest} />;
}

export function HierarchicalFacetChild({
  parentValue,
  field,
  label,
  ...rest
}: TermFacet & { parentValue: string; addRightPadding?: boolean }) {
  const filterHierarchicalChildTerm = useSearchStore((state) => state.filterHierarchicalChildTerm);

  return (
    <CheckboxFilterItem
      onClick={() => {
        filterHierarchicalChildTerm({ parentTerm: field, value: label, parentValue });
      }}
      label={label}
      field={field}
      {...rest}
    />
  );
}

export const HierarchicalTermFacetItem = React.memo(function HierarchicalTermFacetItem({
  field,
  label,
  childBuckets,
  parentField,
  childField,
  title,
  ...rest
}: TermFacet & {
  parentField: string;
  childField: string;
  childBuckets?: AggregationsBuckets<InnerBucket>;
}) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  const filter = useSearchStore((state) => state.filters[parentField]);

  if (!childBuckets || !Array.isArray(childBuckets) || !isHierarchicalFilter(filter)) {
    return null;
  }

  const {
    values: { [label]: childState },
  } = filter;

  const hasChildBuckets = childBuckets?.length;
  const childValues = childBuckets.map((b) => b.key);

  if (childValues.length === 1 && childBuckets[0].key === label) {
    return (
      <Box pr={RIGHT_CHEVRON_SIZE}>
        <HierarchicalFacetParent
          childValues={childValues}
          label={label}
          field={field}
          title={title}
          {...rest}
          indeterminate={childState?.size > 0 && !childValues.every((v) => childState?.has(v))}
        />
      </Box>
    );
  }

  return (
    <Accordion
      sx={{
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
      }}
      disableGutters
      expanded={expanded}
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <HierarchicalAccordionSummary
        // AccordionSummary's root is a <button> (inherited from ButtonBase).
        // The expand icon used to be a <TooltipIconButton>, which made the
        // rendered HTML <button><button/></button> -- invalid and noisy in
        // strict-mode warnings. Render the icon in a clickable span instead;
        // AccordionSummary still handles its own focus/keyboard.
        expandIcon={
          <SecondaryBackgroundTooltip
            describeChild
            title={buildExpandTooltip({ expanded, disabled: !hasChildBuckets })}
            placement="right"
          >
            <Box
              component="span"
              role="presentation"
              onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
                event.stopPropagation();
                if (hasChildBuckets) toggleExpanded();
              }}
              sx={{
                // Match the footprint of the IconButton-sized expand control
                // used by non-hierarchical rows (RIGHT_CHEVRON_SIZE) so all
                // facet counts stay right-aligned in the same column.
                width: RIGHT_CHEVRON_SIZE,
                height: RIGHT_CHEVRON_SIZE,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: (theme) => (hasChildBuckets ? theme.palette.primary.main : theme.palette.action.disabled),
                cursor: hasChildBuckets ? 'pointer' : 'default',
              }}
            >
              <ExpandMoreIcon sx={{ fontSize: '1rem' }} color="inherit" />
            </Box>
          </SecondaryBackgroundTooltip>
        }
      >
        <HierarchicalFacetParent
          childValues={childValues}
          label={label}
          field={field}
          title={title}
          {...rest}
          indeterminate={childState?.size > 0 && !childValues.every((v) => childState?.has(v))}
        />
      </HierarchicalAccordionSummary>
      <AccordionDetails sx={{ ml: 1.5, p: 0 }}>
        {expanded &&
          childBuckets.map(({ key, doc_count }) => (
            <HierarchicalFacetChild
              field={field}
              label={key}
              key={key}
              count={doc_count}
              parentValue={label}
              active={childState?.has(key)}
              title={title}
              addRightPadding
            />
          ))}
      </AccordionDetails>
    </Accordion>
  );
});

export function HierarchicalTermFacet({ field: parentField, childField }: { field: string; childField: string }) {
  const parentAggs = useSearch()?.aggregations?.[parentField]?.[parentField];
  const getFieldLabel = useGetFieldLabel();

  const filter = useSearchStore((state) => state.filters[parentField]);

  if (!(parentAggs && 'buckets' in parentAggs)) {
    return null;
  }

  const parentBuckets = parentAggs.buckets;

  if (!parentBuckets || !Array.isArray(parentBuckets)) {
    return [];
  }

  if (!isHierarchicalFilter(filter)) {
    return null;
  }

  const { values } = filter;

  const title = getFieldLabel(parentField);

  return (
    <FacetAccordion title={title} position="inner">
      {parentBuckets.map((bucket) => {
        const key = getBucketKey(bucket);
        return (
          <HierarchicalTermFacetItem
            label={key}
            count={bucket.doc_count}
            key={key}
            active={key in values}
            field={parentField}
            childField={childField}
            parentField={parentField}
            childBuckets={bucket[childField]?.buckets}
            title={title}
          />
        );
      })}
    </FacetAccordion>
  );
}
