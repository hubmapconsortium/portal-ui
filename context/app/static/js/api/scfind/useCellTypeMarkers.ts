import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { AnnotationNamesList } from './types';
import { createScfindKey, annotationNamesToGetParams } from './utils';

interface CellTypeMarkerInfo {
  cellType: string;
  f1: number;
  fn: number;
  fp: number;
  genes: string;
  precision: number;
  recall: number;
  tp: number;
}

export interface CellTypeMarkersParams {
  cellTypes: string | string[];
  annotationNames?: AnnotationNamesList;
  backgroundCellTypes?: string[];
  backgroundAnnotationNames?: AnnotationNamesList;
  topK?: number;
  sortField?: keyof CellTypeMarkerInfo;
  includePrefix?: boolean;
}

type CellTypeMarkersKey = string;

interface CellTypeMarkersResponse {
  cellTypeMarkers: CellTypeMarkerInfo[];
}

export function createCellTypeMarkersKey({
  cellTypes,
  annotationNames,
  backgroundCellTypes,
  backgroundAnnotationNames,
  topK,
  sortField,
  includePrefix,
}: CellTypeMarkersParams): CellTypeMarkersKey {
  return createScfindKey('cellTypeMarkers', {
    cell_types: Array.isArray(cellTypes) ? cellTypes.join(',') : cellTypes,
    annotation_names: annotationNames ? annotationNamesToGetParams(annotationNames) : undefined,
    background_cell_types: Array.isArray(backgroundCellTypes) ? backgroundCellTypes.join(',') : backgroundCellTypes,
    background_annotation_names: annotationNamesToGetParams(backgroundAnnotationNames),
    top_k: topK ? topK.toString() : undefined,
    include_prefix: includePrefix ? String(includePrefix) : undefined,
    sort_field: sortField,
  });
}

export default function useCellTypeMarkers({
  topK = 10,
  sortField = 'f1',
  includePrefix = true,
  ...params
}: CellTypeMarkersParams) {
  const key = createCellTypeMarkersKey({ topK, sortField, includePrefix, ...params });
  return useSWR<CellTypeMarkersResponse, unknown, CellTypeMarkersKey>(key, (url) => fetcher({ url }));
}
