import { useContext } from 'react';

import { AppContext } from 'js/components/Providers';

import { useSearchHits } from 'js/hooks/useSearchData';

function useDerivedEntitySearchHits(ancestorUUID) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const sampleSpecificDatasetsQuery = {
    query: {
      bool: {
        filter: [
          {
            term: {
              ancestor_ids: ancestorUUID,
            },
          },
          {
            term: {
              entity_type: 'dataset',
            },
          },
        ],
      },
    },
    _source: ['uuid', 'display_doi', 'mapped_data_types', 'status', 'descendant_counts', 'last_modified_timestamp'],
    size: 10000,
  };

  return useSearchHits(sampleSpecificDatasetsQuery, elasticsearchEndpoint, nexusToken);
}

export default useDerivedEntitySearchHits;
