import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

interface FindGeneSignaturesParams {
  cellTypes?: string | string[];
  annotationNames?: AnnotationNamesList;
  minCells?: number;
  minFraction?: number;
}

type FindGeneSignaturesKey = string;

interface FindGeneSignaturesResponse {
  evaluateMarkers: unknown;
}

export function createFindGeneSignaturesKey({
  cellTypes,
  annotationNames,
  minCells,
  minFraction,
}: FindGeneSignaturesParams): FindGeneSignaturesKey {
  return createScfindKey('findGeneSignatures', {
    cell_types: Array.isArray(cellTypes) ? cellTypes.join(',') : cellTypes,
    annotation_names: annotationNamesToGetParams(annotationNames),
    min_cells: minCells ? String(minCells) : undefined,
    min_fraction: minFraction ? String(minFraction) : undefined,
  });
}

export default function useFindGeneSignatures(params: FindGeneSignaturesParams) {
  const key = createFindGeneSignaturesKey(params);
  return useSWR<FindGeneSignaturesResponse, unknown, FindGeneSignaturesKey>(key, (url) => fetcher({ url }));
}
