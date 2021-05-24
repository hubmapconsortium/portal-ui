import { useContext, useMemo } from 'react';

import { AppContext } from 'js/components/Providers';

import { useSearchHits } from 'js/hooks/useSearchData';

function getTypeQuery(ancestorUUID, type) {
  return {
    bool: {
      filter: [
        {
          term: {
            ancestor_ids: ancestorUUID,
          },
        },
        {
          term: {
            entity_type: type,
          },
        },
      ],
    },
  };
}

function useDerivedDatasetSearchHits(ancestorUUID) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const query = useMemo(
    () => ({
      query: getTypeQuery(ancestorUUID, 'dataset'),
      _source: ['uuid', 'display_doi', 'mapped_data_types', 'status', 'descendant_counts', 'last_modified_timestamp'],
      size: 10000,
    }),
    [ancestorUUID],
  );

  return useSearchHits(query, elasticsearchEndpoint, nexusToken);
}

function useDerivedSampleSearchHits(ancestorUUID) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const query = useMemo(
    () => ({
      query: getTypeQuery(ancestorUUID, 'sample'),
      _source: [
        'uuid',
        'display_doi',
        'origin_sample.mapped_organ',
        'mapped_specimen_type',
        'descendant_counts',
        'last_modified_timestamp',
      ],
      size: 10000,
    }),
    [ancestorUUID],
  );
  return useSearchHits(query, elasticsearchEndpoint, nexusToken);
}

export { useDerivedDatasetSearchHits, useDerivedSampleSearchHits };
