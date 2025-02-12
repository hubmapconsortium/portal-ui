import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

export interface FindCellTypeSpecificitiesParams {
  geneList?: string | string[];
  annotationNames?: AnnotationNamesList;
  minCells?: number;
  minFraction?: number;
}

type EvaluateMarkersKey = string;

interface FindCellTypeSpecificitiesResponse {
  evaluateMarkers: unknown;
}

export function createCellTypeSpecificitiesKey({
  geneList,
  annotationNames,
  minCells,
  minFraction,
}: FindCellTypeSpecificitiesParams): EvaluateMarkersKey {
  return createScfindKey('findCellTypeSpecificities', {
    annotation_names: annotationNamesToGetParams(annotationNames),
    gene_list: Array.isArray(geneList) ? geneList.join(',') : geneList,
    min_cells: minCells ? String(minCells) : undefined,
    min_fraction: minFraction ? String(minFraction) : undefined,
  });
}

export default function useFindCellTypeSpecificities(params: FindCellTypeSpecificitiesParams) {
  const key = createCellTypeSpecificitiesKey(params);
  return useSWR<FindCellTypeSpecificitiesResponse, unknown, EvaluateMarkersKey>(key, (url) => fetcher({ url }));
}
