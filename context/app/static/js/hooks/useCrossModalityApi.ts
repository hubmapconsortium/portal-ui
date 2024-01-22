import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import useSWR from 'swr';

/**
 * Features of cells that can be queried.
 */
export type Feature = 'cell-types' | 'genes' | 'proteins';

// Dataset details are currently returned as a list of UUIDs
type FeatureDatasets = string[];

/**
 * Samples corresponding to datasets that contain the requested feature.
 */
export interface FeatureSample {
  hubmap_id: string;
  last_modified_timestamp: number;
  organ: string[];
  sample_category: string;
  uuid: string;
}
type FeatureSamples = FeatureSample[];

/**
 * Organ info for the current feature.
 */
export interface FeatureOrgan {
  feature_cells: number;
  organ: string;
  total_cells: number;
  other_cells: number;
}
type FeatureOrgans = FeatureOrgan[];

export interface FeatureResponse {
  datasets: FeatureDatasets;
  samples: FeatureSamples;
  organs: FeatureOrgans;
}

export const useCrossModalityAPI = () => ({
  featureDetails(feature: Feature, id: string) {
    return `/x-modality/${feature}/${id}.json`;
  },
});

export const useFeatureDetails = (feature: Feature, id: string) => {
  const { data, ...rest } = useSWR<FeatureResponse, SWRError, string>(
    useCrossModalityAPI().featureDetails(feature, id),
    (url) =>
      fetcher<FeatureResponse>({
        url,
        requestInit: {
          headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
          },
        },
      }),
  );
  return { data, ...rest };
};
