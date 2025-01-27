import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

interface FindHouseKeepingGenesParams {
  cellTypes?: string | string[];
  annotationNames?: AnnotationNamesList;
  minRecall?: number;
  maxGenes?: number;
}

type FindHouseKeepingGenesKey = string;

interface FindHouseKeepingGenesResponse {
  findHouseKeepingGenes: unknown;
}

export function createFindHouseKeepingGenesKey({
  cellTypes,
  annotationNames,
  minRecall,
  maxGenes,
}: FindHouseKeepingGenesParams): FindHouseKeepingGenesKey {
  return createScfindKey('findHouseKeepingGenes', {
    cell_types: Array.isArray(cellTypes) ? cellTypes.join(',') : cellTypes,
    annotation_names: annotationNamesToGetParams(annotationNames),
    min_recall: minRecall ? String(minRecall) : undefined,
    max_genes: maxGenes ? String(maxGenes) : undefined,
  });
}

export default function useFindHouseKeepingGenes(params: FindHouseKeepingGenesParams) {
  const key = createFindHouseKeepingGenesKey(params);
  return useSWR<FindHouseKeepingGenesResponse, unknown, FindHouseKeepingGenesKey>(key, (url) => fetcher({ url }));
}
