import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScfindKey, annotationNamesToGetParams } from './utils';
import { AnnotationNamesList } from './types';

interface CellTypeNamesParams {
  geneList: string | string[];
  annotationNames: AnnotationNamesList;
  includePrefix: boolean;
}

interface CellTypeNamesResponse {
  cellTypeNames: string[];
}

type CellTypeNamesKey = string;

export function createCellTypeNamesKey({
  geneList,
  annotationNames,
  includePrefix,
}: CellTypeNamesParams): CellTypeNamesKey {
  return createScfindKey('hyperQueryCellTypes', {
    gene_list: Array.isArray(geneList) ? geneList.join(',') : geneList,
    annotation_names: annotationNamesToGetParams(annotationNames),
    include_prefix: includePrefix ? 'true' : 'false',
  });
}

export default function useHyperQueryCellTypes(params: CellTypeNamesParams) {
  const key = createCellTypeNamesKey(params);
  return useSWR<CellTypeNamesResponse, unknown, CellTypeNamesKey>(key, (url) => fetcher({ url }));
}
