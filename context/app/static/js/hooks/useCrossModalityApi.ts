import { CellTypeInfo } from 'js/components/genes/types';
import { OrganFile } from 'js/components/organ/types';
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
 * Organ info for the cell bar graph is provided as a list of objects with the following properties:
 */
export interface CellTypeOrgan {
  feature_cells: number;
  organ: string;
  total_cells: number;
  other_cells: number;
}

/**
 * Organ info for the gene page is provided as a map of organ names to their corresponding organ file.
 */
export type GeneOrgan = Record<string, OrganFile>;

export type FeatureOrgans<F extends Feature = Feature> = F extends 'cell-types' ? CellTypeOrgan[] : GeneOrgan;

export type FeatureResponse<F extends Feature> = {
  datasets: FeatureDatasets;
  samples: FeatureSamples;
  organs: FeatureOrgans<F>;
} & (F extends 'genes' ? { cell_types: CellTypeInfo[] } : unknown);

export const useCrossModalityAPI = () => ({
  featureDetails(feature: Feature, id: string) {
    return `/x-modality/${feature}/${id}.json`;
  },
});

export const useFeatureDetails = <F extends Feature>(feature: F, id: string) => {
  const { data, ...rest } = useSWR<FeatureResponse<F>, SWRError, string>(
    useCrossModalityAPI().featureDetails(feature, id),
    (url) =>
      fetcher<FeatureResponse<F>>({
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
