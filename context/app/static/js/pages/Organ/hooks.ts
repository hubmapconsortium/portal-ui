import { useMemo } from 'react';
import useSWR from 'swr';

import { multiFetcher } from 'js/helpers/swr/fetchers';
import useSearchData, { useSearchHits } from 'js/hooks/useSearchData';
import { useAppContext } from 'js/components/Contexts';
import { OrganDataProducts, OrganFile } from 'js/components/organ/types';
import useCellTypeNames from 'js/api/scfind/useCellTypeNames';
import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import { useOrganContext } from 'js/components/organ/contexts';
import useSCFindIDAdapter from 'js/api/scfind/useSCFindIDAdapter';
import { mustHaveOrganClause } from './queries';

export function useSearchItems(organ: OrganFile) {
  const searchItems = useMemo(
    () => (organ.search.length > 0 ? organ.search : [organ.name]),
    [organ.search, organ.name],
  );

  return searchItems;
}

export function useSearchItemsFromContext() {
  const { organ } = useOrganContext();
  return useSearchItems(organ);
}

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
      query: {
        bool: {
          filter: [
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
              term: {
                'calculated_metadata.annotation_tools.keyword': 'Azimuth',
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
  const urls = possibleNames.map((n) => `${dataProductsEndpoint}/api/data_products/tissue/${n}`);

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

/**
 * Returns a list of cell type names indexed in scFind for the current organ.
 * @param organ The organ to filter cell types by, e.g., 'kidney', 'liver'.
 * @returns {string[]} A list of cell type names for the specified organ.
 */
export function useCellTypesOfOrgan(organ: string) {
  const { data } = useCellTypeNames();
  return useMemo(() => {
    if (!data) {
      return [];
    }
    return data.cellTypeNames
      .filter((cellTypeName) => cellTypeName.toLowerCase().startsWith(`${organ.toLowerCase()}.`))
      .map((cellTypeName) => cellTypeName.split('.')[1]);
  }, [data, organ]);
}

interface IndexedDatasetsForOrganAggs {
  datasetTypes: {
    buckets: {
      key: string;
      doc_count: number;
    }[];
  };
}

/**
 * Returns a list of the dataset IDs indexed in scFind for the current organ.
 * @param organ
 * @returns
 */
export function useIndexedDatasetsForOrgan() {
  const searchItems = useSearchItemsFromContext();
  const { data = { datasets: [] }, isLoading: isLoadingIndexed, ...rest } = useIndexedDatasets();

  const ids = useSCFindIDAdapter(data?.datasets);

  const { searchData, isLoading: isLoadingDatasets } = useSearchData<unknown, IndexedDatasetsForOrganAggs>({
    query: {
      bool: {
        must: [
          {
            ids: {
              values: ids,
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
    aggs: {
      datasetTypes: {
        terms: {
          field: 'raw_dataset_type.keyword',
          order: {
            _term: 'asc',
          },
          size: 10000,
        },
      },
    },
    size: 10000,
    _source: ['hubmap_id'],
  });

  const datasetUUIDs = searchData?.hits?.hits.map((h) => h._id) ?? [];

  const datasetTypes = searchData?.aggregations?.datasetTypes?.buckets ?? [];

  return {
    datasets: datasetUUIDs,
    isLoading: isLoadingIndexed || isLoadingDatasets,
    datasetTypes,
    filters: {
      organTerms: searchItems,
    },
    scFindParams: {
      scFindOnly: true,
    },
    ...rest,
  };
}
