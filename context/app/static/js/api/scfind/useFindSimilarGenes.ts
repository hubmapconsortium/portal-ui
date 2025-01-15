import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

interface FindSimilarGenesParams {
  cellTypes?: string | string[];
  annotationNames?: AnnotationNamesList;
  minRecall?: number;
  maxGenes?: number;
}

type FindSimilarGenesKey = string;

interface FindSimilarGenesResponse {
  evaluateMarkers: unknown;
}

export function createFindSimilarGenesKey({
  cellTypes,
  annotationNames,
  minRecall,
  maxGenes,
}: FindSimilarGenesParams): FindSimilarGenesKey {
  return createScfindKey('findSimilarGenes', {
    cell_types: Array.isArray(cellTypes) ? cellTypes.join(',') : cellTypes,
    annotation_names: annotationNamesToGetParams(annotationNames),
    min_recall: minRecall ? String(minRecall) : undefined,
    max_genes: maxGenes ? String(maxGenes) : undefined,
  });
}

export default function useFindSimilarGenes(params: FindSimilarGenesParams) {
  const key = createFindSimilarGenesKey(params);
  return useSWR<FindSimilarGenesResponse, unknown, FindSimilarGenesKey>(key, (url) => fetcher({ url }));
}
