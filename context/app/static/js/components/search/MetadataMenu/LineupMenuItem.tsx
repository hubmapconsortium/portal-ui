import React, { useMemo } from 'react';

import { StyledMenuItem } from './style';
import { useMetadataMenu } from './hooks';
import { useLineUpModalStore } from 'js/stores/useLineUpModalStore';
import { ESEntityType } from 'js/components/types';
import { useSearchStore, filterHasValues } from 'js/components/search/store';
import { buildQuery } from 'js/components/search/utils';
import useEsMapping, { isESMapping } from 'js/components/search/useEsMapping';

interface LineupMenuItemProps {
  lcPluralType: string;
}

// Map plural lowercase entity types to singular capitalized ones, if applicable
const entityTypeMap: Record<string, ESEntityType | undefined> = {
  donors: 'Donor',
  samples: 'Sample',
  datasets: 'Dataset',
  entities: undefined,
};

export default function LineupMenuItem({ lcPluralType }: LineupMenuItemProps) {
  const { selectedHits, closeMenu } = useMetadataMenu();
  const { open } = useLineUpModalStore();

  const searchStore = useSearchStore();
  const mappings = useEsMapping();

  const entityType = entityTypeMap[lcPluralType];

  // Convert SearchStore filters to Elasticsearch query format
  const filtersQuery = useMemo(() => {
    if (!isESMapping(mappings)) {
      return undefined;
    }

    // Only include filters that have values
    const activeFilters = Object.fromEntries(
      Object.entries(searchStore.filters).filter(([, filter]) => filterHasValues({ filter })),
    );

    if (Object.keys(activeFilters).length === 0) {
      return undefined;
    }

    const builtQuery = buildQuery({
      filters: activeFilters,
      facets: searchStore.facets,
      search: '',
      size: 0,
      searchFields: [],
      sourceFields: {},
      sortField: searchStore.sortField,
      mappings,
      buildAggregations: false,
    });

    // Extract just the post_filter from the built query for use in our custom query
    // Type assertion is safe here because buildQuery returns a structured object
    return (builtQuery as { post_filter?: Record<string, unknown> })?.post_filter;
  }, [searchStore.filters, searchStore.facets, searchStore.sortField, mappings]);

  const handleClick = () => {
    const uuids = selectedHits.size > 0 ? Array.from(selectedHits) : undefined;

    // If we have selected hits, use those UUIDs; otherwise pass the filters
    const modalParams = uuids ? { uuids, entityType } : { entityType, filters: filtersQuery };

    open(modalParams);
    closeMenu();
  };

  return (
    <StyledMenuItem
      onClick={handleClick}
      tooltip={`Visualize selected ${lcPluralType}' metadata in Lineup. If no selection exists, all ${lcPluralType} will be included in the visualization.`}
    >
      Visualize
    </StyledMenuItem>
  );
}
