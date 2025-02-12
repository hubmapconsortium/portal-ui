import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

type MarkerGenesKey = string;

type MarkerGenesResponse = object[];

export interface MarkerGenesParams {
  markerGenes: string | string[];
  datasetName?: string;
  annotationNames?: AnnotationNamesList;
  exhaustive?: boolean;
  supportCutoff?: number;
}

function createMarkerGenesKey({
  markerGenes,
  datasetName,
  annotationNames,
  exhaustive,
  supportCutoff,
}: MarkerGenesParams): MarkerGenesKey {
  return createScfindKey('markerGenes', {
    marker_genes: Array.isArray(markerGenes) ? markerGenes.join(',') : markerGenes,
    dataset_name: datasetName,
    annotation_names: annotationNamesToGetParams(annotationNames),
    exhaustive: exhaustive !== undefined ? String(exhaustive) : undefined,
    support_cutoff: supportCutoff !== undefined ? String(supportCutoff) : undefined,
  });
}

export default function useMarkerGenes(params: MarkerGenesParams) {
  const key = createMarkerGenesKey(params);
  return useSWR<MarkerGenesResponse, unknown, MarkerGenesKey>(key, (url) => fetcher({ url }));
}
