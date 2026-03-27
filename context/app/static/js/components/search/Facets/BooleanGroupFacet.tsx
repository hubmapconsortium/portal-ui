import React, { useCallback } from 'react';

import { trackEvent } from 'js/helpers/trackers';
import { decimal } from 'js/helpers/number-format';
import {
  BooleanGroupConfig,
  BooleanGroupValues,
  getBooleanGroupItemKey,
  isBooleanGroupFilter,
  useSearchStore,
} from '../store';
import { useSearch } from '../Search';
import {
  StyledCheckBoxBlankIcon,
  StyledCheckBoxIcon,
  StyledCheckbox,
  StyledFormControlLabel,
  StyledStack,
  FormLabelText,
  RIGHT_CHEVRON_SIZE,
} from './style';
import FacetAccordion from './FacetAccordion';
import Typography from '@mui/material/Typography';

interface ItemAggregation {
  doc_count: number;
}

function BooleanGroupItem({
  groupField,
  itemKey,
  label,
  count,
  active,
}: {
  groupField: string;
  itemKey: string;
  label: string;
  count: number;
  active: boolean;
}) {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);
  const filterBooleanGroupItem = useSearchStore((state) => state.filterBooleanGroupItem);

  const handleClick = useCallback(() => {
    filterBooleanGroupItem({ field: groupField, itemKey });
    const facetAction = active ? 'Unselect' : 'Select';
    trackEvent({
      category: analyticsCategory,
      action: `${facetAction} Facet`,
      label: `Dataset Features: ${label}`,
    });
  }, [active, analyticsCategory, filterBooleanGroupItem, groupField, itemKey, label]);

  return (
    <StyledFormControlLabel
      control={
        <StyledCheckbox
          checked={active}
          name={`${label}-checkbox`}
          color="primary"
          icon={<StyledCheckBoxBlankIcon />}
          checkedIcon={<StyledCheckBoxIcon />}
          onChange={handleClick}
        />
      }
      label={
        <StyledStack direction="row" justifyContent="space-between" $active={active} pr={RIGHT_CHEVRON_SIZE}>
          <FormLabelText>{label}</FormLabelText>
          <Typography>{decimal.format(count)}</Typography>
        </StyledStack>
      }
    />
  );
}

function BooleanGroupFacetContent({
  filter,
  facetConfig,
}: {
  filter: BooleanGroupValues;
  facetConfig: BooleanGroupConfig;
}) {
  const { aggregations } = useSearch();
  const groupAgg = aggregations?.[facetConfig.field];

  const allCountsAreZero = facetConfig.items.every((item) => {
    const itemKey = getBooleanGroupItemKey(item);
    const itemAgg = groupAgg?.[itemKey] as ItemAggregation | undefined;
    return (itemAgg?.doc_count ?? 0) === 0;
  });

  // For consistency with other facet types, hide the facet if all counts are zero (e.g. during loading)
  if (allCountsAreZero) {
    return null;
  }

  return (
    <FacetAccordion title="Dataset Features" position="inner">
      {facetConfig.items.map((item) => {
        const itemKey = getBooleanGroupItemKey(item);
        const itemAgg = groupAgg?.[itemKey] as ItemAggregation | undefined;
        const count = itemAgg?.doc_count ?? 0;

        return (
          <BooleanGroupItem
            key={itemKey}
            groupField={facetConfig.field}
            itemKey={itemKey}
            label={item.label}
            count={count}
            active={filter.values.has(itemKey)}
          />
        );
      })}
    </FacetAccordion>
  );
}

function BooleanGroupFacet({ field }: { field: string }) {
  const filter = useSearchStore((state) => state.filters[field]);
  const facetConfig = useSearchStore((state) => state.facets[field]);

  if (!isBooleanGroupFilter(filter) || facetConfig.type !== 'BOOLEAN_GROUP') {
    return null;
  }

  return <BooleanGroupFacetContent filter={filter} facetConfig={facetConfig} />;
}

export default BooleanGroupFacet;
