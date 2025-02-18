import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

type CellTypeNamesKey = string;

export interface CellTypeNamesParams {
  annotationNames: AnnotationNamesList;
}

interface CellTypeNamesResponse {
  cellTypeNames: string[];
}

export function createCellTypeNamesKey(params?: CellTypeNamesParams): CellTypeNamesKey {
  return createScfindKey('cellTypeNames', {
    annotation_names: annotationNamesToGetParams(params?.annotationNames),
  });
}

export default function useCellTypeNames(params?: CellTypeNamesParams) {
  const key = createCellTypeNamesKey(params);
  return useSWR<CellTypeNamesResponse, unknown, CellTypeNamesKey>(key, (url) => fetcher({ url }));
}
