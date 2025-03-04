import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr/fetchers';
import useSearchData, { useSearchHits } from 'js/hooks/useSearchData';
import { useAppContext } from 'js/components/Contexts';
import { OrganDataProducts } from 'js/components/organ/types';
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

// TODO:  This is a placeholder for the actual implementation.
//        These are all of the publicly accessible datasets with complete Azimuth annotations.
//        They are all rna-seq and either kidney or heart, however,
//        there are also unannotated datasets that fall into those categories.
//        Thus, since we do not currently have a programmatic way to tell
//        whether a dataset actually has labels yet, we are using this hardcoded list.
export const DATASETS_WITH_LABELS = [
  'ad693f99fb9006e68a53e97598da1509',
  '173de2e80adf6a73ac8cff5ccce20dfc',
  'b95f34761c252ebbd1e482cd9afae73f',
  '5a5ca03fa623602d9a859224aa40ace4',
  '3c1b10bc912c60c9afc36b7423695236',
  '1dc16eb0270ff73291dd45b6a96aa3c0',
  'b05c21f9c94ce1a22a9694cd0fe0291e',
  '8cdb42ed1194255c74c8462b99bbd7ef',
  'fe0ded5fc0355c95239f9c040dd31e99',
  '367fee3b40cba682063289505b922be1',
  'b99fc30c4195958fbef217fa9ed9ec8f',
  '898138b7f45a67c574e9955fb400e9be',
  'f220c9e7bcaea3a87162cbe61287ea4d',
  'e5f7a14d93659bd0b8dc2819ffa9bc4b',
  '56cbda4789f04d79c0c3dffe21816d48',
  '0b6f63f2bd61a8c091fc7afc0f318ad1',
  '62efbe0a6abd0bcf53ab9ab29e7cd73f',
  '4b62d9d2c248323ce029859f953fdc57',
  'c81b0dc9d16eb825a7d6bce6e1b3678f',
  '5ee240959c96b49d960702755478b9fc',
  '7c9e07c96d144536525b1f889acee14d',
  'dd7ccbc306692fc5ff5e61c22845da21',
  '9a7e6be288b27ddbd3366c4ae41bbcd2',
  '018a905cdbdff684760859f594d3fd77',
  'af5741dad7aecf7960a129c3d2ae642a',
  '6e1db473492095ccc2f1393d7259b9c0',
  'fae9a1f2e7abefca2203765a3c7a5ba1',
  '8d631eee88855ac59155edca2a3bc1ca',
  '1ea6c0ac5ba60fe35bf63af8699b6fbe',
  '224e01ccfc20977ee5a6a6a5b96aa7d7',
  '33b9c54d7c295897826e1e5271d4fc24',
  'a48ab0bf5d8084da24859c4e64336e9c',
];

export function useLabelledDatasetsQuery(searchItems: string[]) {
  const datasetsQuery = useMemo(
    () => ({
      post_filter: {
        bool: {
          must: [
            {
              ids: {
                values: DATASETS_WITH_LABELS,
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
      query: {
        bool: {
          must: [
            {
              term: {
                'entity_type.keyword': 'Dataset',
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

export function useDataProducts(organName: string) {
  const { dataProductsEndpoint } = useAppContext();
  const dataProductsUrl = `${dataProductsEndpoint}/api/data_products/${organName}`;

  const { data } = useSWR<OrganDataProducts[]>(
    dataProductsUrl,
    (url: string) =>
      fetcher({
        url,
      }),
    { fallbackData: [] },
  );

  const dataProducts = data ?? [];

  const dataProductsWithUUIDs = dataProducts.map((product) => {
    const datasetUUIDs = product.dataSets.map((dataset) => dataset.uuid);
    return { ...product, datasetUUIDs };
  });

  return dataProductsWithUUIDs;
}
