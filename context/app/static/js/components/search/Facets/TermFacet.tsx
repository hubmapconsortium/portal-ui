import React, { useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AggregationsBuckets } from '@elastic/elasticsearch/lib/api/types';

import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { useSearch } from '../Search';
import { useSearchStore } from '../store';
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

interface CheckboxItem {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  indeterminate?: boolean;
}

type LabelTransformations = ((label: string) => string)[];

interface TermLabelCount extends Omit<CheckboxItem, 'field' | 'indeterminate' | 'onClick'> {
  labelTransformations?: LabelTransformations;
}

export function transformLabel({
  label,
  labelTransformations,
}: Required<Pick<TermLabelCount, 'label' | 'labelTransformations'>>) {
  return labelTransformations.reduce((l, transformFn) => transformFn(l), label);
}

export function TermLabelAndCount({ label, count, active, labelTransformations = [] }: TermLabelCount) {
  return (
    <StyledStack direction="row" justifyContent="space-between" $active={active}>
      <FormLabelText>{transformLabel({ label, labelTransformations })}</FormLabelText>
      <Typography>{count}</Typography>
    </StyledStack>
  );
}

function CheckboxFilterItem({ active, label, count, onClick, indeterminate = false }: CheckboxItem) {
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
          onClick={onClick}
        />
      }
      label={<TermLabelAndCount label={label} count={count} active={active} />}
    />
  );
}

interface TermFacet extends Omit<CheckboxItem, 'onClick'> {
  field: string;
}

export function TermFacetItem({ label, field, ...rest }: TermFacet) {
  const { filterTerm } = useSearchStore();

  return <CheckboxFilterItem onClick={() => filterTerm({ term: field, value: label })} label={label} {...rest} />;
}

export function TermFacet({ field }: { field: string }) {
  const { aggregations } = useSearch();
  const {
    terms: { [field]: term },
  } = useSearchStore();

  const aggBuckets = aggregations?.[field]?.buckets;

  if (!aggBuckets || !Array.isArray(aggBuckets)) {
    return null;
  }

  return (
    <FacetAccordion title={field} position="inner">
      {aggBuckets.map((bucket) => (
        <TermFacetItem
          label={bucket.key}
          count={bucket.doc_count}
          key={bucket.key}
          active={term.has(bucket.key)}
          field={field}
        />
      ))}
    </FacetAccordion>
  );
}

function buildExpandTooltip({ expanded, disabled }: { expanded: boolean; disabled: boolean }) {
  if (disabled) {
    return undefined;
  }

  return expanded ? 'View Less' : 'View More';
}

export function HierarchicalFacetParent({ childValues, field, label, ...rest }: TermFacet & { childValues: string[] }) {
  const { filterHierarchicalParentTerm } = useSearchStore();

  return (
    <CheckboxFilterItem
      onClick={() => filterHierarchicalParentTerm({ term: field, value: label, childValues })}
      label={label}
      {...rest}
    />
  );
}

export function HierarchicalFacetChild({ parentValue, field, label, ...rest }: TermFacet & { parentValue: string }) {
  const { filterHierarchicalChildTerm } = useSearchStore();

  return (
    <CheckboxFilterItem
      onClick={() => filterHierarchicalChildTerm({ parentTerm: field, value: label, parentValue })}
      label={label}
      {...rest}
    />
  );
}

export function HierarchicalTermFacetItem({
  field,
  label,
  childBuckets,
  parentField,
  childField,
  ...rest
}: TermFacet & {
  parentField: string;
  childField: string;
  childBuckets?: AggregationsBuckets<{ key: string; doc_count: number }>;
}) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  const {
    termz: {
      [parentField]: {
        values: { [label]: childState },
      },
    },
  } = useSearchStore();

  if (!childBuckets || !Array.isArray(childBuckets)) {
    return null;
  }

  const hasChildBuckets = childBuckets?.length;
  const childValues = childBuckets.map((b) => b.key);

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
          {...rest}
          indeterminate={childState?.size > 0 && !childValues.every((v) => childState?.has(v))}
        />
      </HierarchicalAccordionSummary>
      <AccordionDetails sx={{ ml: 1.5, p: 0 }}>
        {childBuckets.map(({ key, doc_count }) => (
          <HierarchicalFacetChild
            field={field}
            label={key}
            key={key}
            count={doc_count}
            parentValue={label}
            active={childState?.has(key)}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

export function HierarchicalTermFacet({ parentField, childField }: { parentField: string; childField: string }) {
  const { aggregations } = useSearch();

  const {
    termz: {
      [parentField]: { values },
    },
  } = useSearchStore();

  if (!aggregations) {
    return null;
  }

  const parentBuckets = aggregations?.[parentField]?.buckets;

  if (!parentBuckets || !Array.isArray(parentBuckets)) {
    return null;
  }

  return (
    <FacetAccordion title={parentField} position="inner">
      {parentBuckets.map((bucket) => (
        <HierarchicalTermFacetItem
          label={bucket.key}
          count={bucket.doc_count}
          key={bucket.key}
          active={bucket.key in values}
          field={parentField}
          childField={childField}
          parentField={parentField}
          childBuckets={bucket[childField]?.buckets}
        />
      ))}
    </FacetAccordion>
  );
}
