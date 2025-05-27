import { useMemo } from 'react';
import useSWR from 'swr';

import { multiFetcher } from 'js/helpers/swr/fetchers';
import useSearchData, { useSearchHits } from 'js/hooks/useSearchData';
import { useAppContext } from 'js/components/Contexts';
import { OrganDataProducts, OrganFile } from 'js/components/organ/types';
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
            'assay_display_name.keyword': { terms: { field: 'assay_display_name.keyword', size: 10_000 } },
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

export function useLabelledDatasetsQuery(searchItems: string[]) {
  const datasetsQuery = useMemo(
    () => ({
      filter: {
        bool: {
          must: [
            {
              term: {
                'entity_type.keyword': 'Dataset',
              },
            },
            {
              term: {
                'raw_dataset_type.keyword': 'RNAseq',
              },
            },
            {
              exists: {
                field: 'calculated_metadata.annotation_tools',
              },
            },
            {
              terms: {
                'origin_samples_unique_mapped_organs.keyword': searchItems,
              },
            },
          ],
        },
      },
      _source: false,
      size: 10000,
    }),
    [searchItems],
  );
  const { searchHits: datasetsHits } = useSearchHits<never>(datasetsQuery, { useDefaultQuery: false });
  return datasetsHits.map((hit) => hit._id);
}

export function useDataProducts(organ: OrganFile) {
  const { name, search } = organ;
  const { dataProductsEndpoint } = useAppContext();

  const isLateral = search?.length > 1;

  const possibleNames = isLateral ? [`${name} (Right)`, `${name} (Left)`] : [name];
  const urls = possibleNames.map((n) => `${dataProductsEndpoint}/api/data_products/${n}`);

  const { data, isLoading } = useSWR<OrganDataProducts[]>(urls, (u: string[]) => multiFetcher({ urls: u }), {
    fallbackData: [],
  });

  const dataProducts = (data ?? []).flat();
  const dataProductsWithUUIDs = dataProducts.map((product) => ({
    ...product,
    datasetUUIDs: product.dataSets.map((dataset) => dataset.uuid),
  }));

  return { dataProducts: dataProductsWithUUIDs, isLoading, isLateral };
}
