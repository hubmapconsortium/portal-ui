import { useMemo } from 'react';
import useSearchData, { useSearchHits } from 'js/hooks/useSearchData';
import { mustHaveOrganClause } from './queries';

export function useHasSamplesQuery(searchItems: string[]) {
  const samplesQuery = useMemo(
    () => ({
      query: {
        bool: {
          must: [
            {
              term: {
                'entity_type.keyword': 'Sample',
              },
            },
            mustHaveOrganClause(searchItems),
          ],
        },
      },
      _source: false,
      size: 1,
    }),
    [searchItems],
  );

  const { searchHits: samplesHits } = useSearchHits(samplesQuery);
  return samplesHits;
}

interface Bucket {
  key: string;
  doc_count: number;
}

interface AssayBucketAggregations {
  mapped_data_types: {
    'assay_display_name.keyword': {
      buckets: Bucket[];
    };
  };
}

export function useAssayBucketsQuery(searchItems: string[]) {
  const assaysQuery = useMemo(
    () => ({
      size: 0,
      aggs: {
        mapped_data_types: {
          filter: {
            bool: {
              must: [
                {
                  term: {
                    'entity_type.keyword': 'Dataset',
                  },
                },
                mustHaveOrganClause(searchItems),
              ],
            },
          },
          aggs: {
            'assay_display_name.keyword': { terms: { field: 'assay_display_name.keyword', size: 100 } },
          },
        },
      },
    }),
    [searchItems],
  );

  const { searchData: assaysData } = useSearchData<never, AssayBucketAggregations>(assaysQuery);

  const assayBuckets = assaysData?.aggregations?.mapped_data_types?.['assay_display_name.keyword']?.buckets ?? [];

  return assayBuckets;
}
