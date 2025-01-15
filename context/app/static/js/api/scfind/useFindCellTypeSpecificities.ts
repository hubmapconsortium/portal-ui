import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

interface EvaluateMarkersParams {
  geneList?: string | string[];
  annotationNames?: AnnotationNamesList;
  minCells?: number;
  minFraction?: number;
}

type EvaluateMarkersKey = string;

interface EvaluateMarkersResponse {
  evaluateMarkers: unknown;
}

export function createCellTypeSpecificitiesKey({
  geneList,
  annotationNames,
  minCells,
  minFraction,
}: EvaluateMarkersParams): EvaluateMarkersKey {
  return createScfindKey('findCellTypeSpecificities', {
    annotation_names: annotationNamesToGetParams(annotationNames),
    gene_list: Array.isArray(geneList) ? geneList.join(',') : geneList,
    min_cells: minCells ? String(minCells) : undefined,
    min_fraction: minFraction ? String(minFraction) : undefined,
  });
}

export default function useFindCellTypeSpecificities(params: EvaluateMarkersParams) {
  const key = createCellTypeSpecificitiesKey(params);
  return useSWR<EvaluateMarkersResponse, unknown, EvaluateMarkersKey>(key, (url) => fetcher({ url }));
}
