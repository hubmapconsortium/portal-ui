import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { AggregationsBuckets } from '@elastic/elasticsearch/lib/api/types';

import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
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
} from './style';
import FacetAccordion from './FacetAccordion';
import { getFieldLabel, getTransformedFieldValue } from '../fieldConfigurations';

interface CheckboxItem {
  label: string;
  count: number;
  title: string;
  active: boolean;
  onClick: () => void;
  indeterminate?: boolean;
  field: string;
}

function getBucketKey(bucket: InnerBucket) {
  const { key, key_as_string } = bucket;
  return key_as_string ?? key;
}

type TermLabelCount = Omit<CheckboxItem, 'field' | 'indeterminate' | 'onClick' | 'title'>;

export function TermLabelAndCount({ label, count, active }: TermLabelCount) {
  return (
    <StyledStack direction="row" justifyContent="space-between" $active={active}>
      <FormLabelText>{label}</FormLabelText>
      <Typography>{count}</Typography>
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
}: CheckboxItem) {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

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
        <TermLabelAndCount label={getTransformedFieldValue({ value: label, field })} count={count} active={active} />
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

  return <CheckboxFilterItem onClick={handleClick} label={label} field={field} {...rest} />;
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

function TermFacetContent({ filter, field }: { filter: TermValues; field: string }) {
  const { aggregations } = useSearch();
  const [showLessTerms, setShowLessTerms] = useState(true);

  const innerAggregations = aggregations?.[field]?.[field];
  const aggBuckets = innerAggregations?.buckets;

  const toggleTermsCount = useCallback(() => {
    setShowLessTerms((prev) => !prev);
  }, [setShowLessTerms]);

  if (!aggBuckets || !Array.isArray(aggBuckets)) {
    return null;
  }

  const title = getFieldLabel(field);
  return (
    <FacetAccordion title={title} position="inner">
      {aggBuckets.slice(...(showLessTerms ? [0, smallAggSize] : [undefined, undefined])).map((bucket) => {
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
      {aggBuckets.length > smallAggSize && (
        <FacetSizeButton hasMoreBuckets={showLessTerms} handleExpand={toggleTermsCount} />
      )}
    </FacetAccordion>
  );
}

export function TermFacet({ field }: { field: string }) {
  const filter = useSearchStore((state) => state.filters[field]);

  if (!isTermFilter(filter)) {
    return null;
  }

  return <TermFacetContent field={field} filter={filter} />;
}

function buildExpandTooltip({ expanded, disabled }: { expanded: boolean; disabled: boolean }) {
  if (disabled) {
    return undefined;
  }

  return expanded ? 'View Less' : 'View More';
}

export function HierarchicalFacetParent({ childValues, field, label, ...rest }: TermFacet & { childValues: string[] }) {
  const filterHierarchicalParentTerm = useSearchStore((state) => state.filterHierarchicalParentTerm);

  const f = useCallback(
    () => filterHierarchicalParentTerm({ term: field, value: label, childValues }),
    [field, label, childValues, filterHierarchicalParentTerm],
  );
  return <CheckboxFilterItem onClick={f} label={label} field={field} {...rest} />;
}

export function HierarchicalFacetChild({ parentValue, field, label, ...rest }: TermFacet & { parentValue: string }) {
  const filterHierarchicalChildTerm = useSearchStore((state) => state.filterHierarchicalChildTerm);

  return (
    <CheckboxFilterItem
      onClick={() => filterHierarchicalChildTerm({ parentTerm: field, value: label, parentValue })}
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
      // 26px is the width of the Accordion's expand icon.
      <Box pr="26px">
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
        expandIcon={
          <TooltipIconButton
            onClick={toggleExpanded}
            size="small"
            color="primary"
            disabled={!hasChildBuckets}
            tooltip={buildExpandTooltip({ expanded, disabled: !hasChildBuckets })}
            placement="right"
          >
            <ExpandMoreIcon sx={{ fontSize: '1rem' }} color="inherit" />
          </TooltipIconButton>
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
            />
          ))}
      </AccordionDetails>
    </Accordion>
  );
});

export function HierarchicalTermFacet({ field: parentField, childField }: { field: string; childField: string }) {
  const parentBuckets = useSearch()?.aggregations?.[parentField]?.[parentField]?.buckets;

  const filter = useSearchStore((state) => state.filters[parentField]);

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
