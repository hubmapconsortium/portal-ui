import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

type CellTypeNamesKey = string;

interface CellTypeNamesParams {
  annotationNames: AnnotationNamesList;
}

interface CellTypeNamesResponse {
  cellTypeNames: string[];
}

export function createCellTypeNamesKey(annotationNames?: AnnotationNamesList): CellTypeNamesKey {
  return createScfindKey('cellTypeNames', {
    annotation_names: annotationNames ? annotationNamesToGetParams(annotationNames) : undefined,
  });
}

export default function useCellTypeNames({ annotationNames }: CellTypeNamesParams) {
  const key = createCellTypeNamesKey(annotationNames);
  return useSWR<CellTypeNamesResponse, unknown, CellTypeNamesKey>(key, (url) => fetcher({ url }));
}
