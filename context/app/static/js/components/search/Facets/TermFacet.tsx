import React from 'react';
import Typography from '@mui/material/Typography';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';

import { useSearch } from '../Search';
import { useSearchStore } from '../store';
import {
  StyledCheckBoxBlankIcon,
  StyledCheckBoxIcon,
  StyledCheckbox,
  StyledFormControlLabel,
  StyledStack,
  FormLabelText,
} from './style';
import FacetAccordion from './FacetAccordion';

interface TermFacet {
  label: string;
  count: number;
  active: boolean;
  field: string;
}

type LabelTransformations = ((label: string) => string)[];

interface TermLabelCount extends Omit<TermFacet, 'field'> {
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

export function TermFacetItem({ active, label, count, field }: TermFacet) {
  const { filterTerm } = useSearchStore();

  return (
    <StyledFormControlLabel
      control={
        <StyledCheckbox
          checked={active}
          indeterminateIcon={<IndeterminateCheckBoxOutlinedIcon fontSize="small" />}
          name={`${label}-checkbox`}
          color="primary"
          icon={<StyledCheckBoxBlankIcon />}
          checkedIcon={<StyledCheckBoxIcon />}
          onClick={() => filterTerm({ term: field, value: label })}
        />
      }
      label={<TermLabelAndCount label={label} count={count} active={active} />}
    />
  );
}

export function TermFacet({ field }: { field: string }) {
  const { data } = useSearch();
  const {
    terms: { [field]: term },
  } = useSearchStore();

  const aggBuckets = data?.aggregations?.[field]?.buckets;

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
