import useSearchData, { Hit, useSearchHits } from 'js/hooks/useSearchData';
import { ContributorAPIResponse } from 'js/components/detailPage/ContributorsTable/utils';
import { recentPublicationsQuery, recentDatasetsQuery } from './queries';

export interface RecentPublication {
  last_modified_timestamp: number;
  publication_date: string;
  publication_status: boolean;
  publication_venue: string;
  title: string;
  uuid: string;
  contributors: ContributorAPIResponse[];
}

export function useRecentPublicationsQuery() {
  const { searchHits, isLoading } = useSearchHits<RecentPublication>(recentPublicationsQuery);
  const recentPublications = searchHits.map((hit) => hit._source);
  return { recentPublications, isLoading };
}

export interface RecentDataset {
  uuid: string;
  title: string;
  group_name: string;
  last_modified_timestamp: number;
  dataset_type: string;
  visualization: boolean;
  origin_samples_unique_mapped_organs: string[];
  hubmap_id: string;
}

interface RecentDatasetAggregation {
  unique_dataset_types: {
    buckets: {
      doc_count: number;
      key: string;
      latest_datasets: {
        hits: {
          hits: Hit<RecentDataset>[];
        };
      };
    }[];
  };
}

export function useRecentDatasetsQuery() {
  const { searchData, isLoading } = useSearchData<RecentDataset, RecentDatasetAggregation>(recentDatasetsQuery);
  const recentDatasets = searchData?.aggregations?.unique_dataset_types.buckets
    // Flatten the buckets
    .flatMap((bucket) => bucket.latest_datasets.hits.hits)
    .flatMap((hit) => hit._source)
    // Sort by last modified timestamp
    .sort((a, b) => b.last_modified_timestamp - a.last_modified_timestamp)
    // Only keep one dataset for each organ mapping
    .filter(
      (dataset, index, datasets) =>
        datasets.findIndex(
          (d) =>
            d.origin_samples_unique_mapped_organs.length === dataset.origin_samples_unique_mapped_organs.length &&
            d.origin_samples_unique_mapped_organs.every((o) => dataset.origin_samples_unique_mapped_organs.includes(o)),
        ) === index,
    )
    // Only keep 6 latest datasets
    .slice(0, 6);

  return { recentDatasets, isLoading };
}
