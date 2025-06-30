import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

export interface HyperQueryCellTypesParams {
  geneList: string | string[];
  datasetName?: string | string[];
  includePrefix?: boolean;
}

export interface GeneSignatureStats {
  'adj-pval': number;
  cell_hits: number;
  cell_type: string;
  pval: number;
  total_cells: number;
}

interface CellTypeNamesResponse {
  findGeneSignatures: GeneSignatureStats[];
}

type HyperQueryCellTypesKey = string;

export function createCellTypeNamesKey(
  scFindEndpoint: string,
  { geneList, datasetName, includePrefix }: HyperQueryCellTypesParams,
): HyperQueryCellTypesKey {
  return createScFindKey(scFindEndpoint, 'hyperQueryCellTypes', {
    gene_list: Array.isArray(geneList) ? geneList.join(',') : geneList,
    dataset_name: Array.isArray(datasetName) ? datasetName.join(',') : datasetName,
    include_prefix: includePrefix ? 'true' : 'false',
  });
}

export default function useHyperQueryCellTypes(params: HyperQueryCellTypesParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createCellTypeNamesKey(scFindEndpoint, params);
  return useSWR<CellTypeNamesResponse, unknown, HyperQueryCellTypesKey>(key, (url) => fetcher({ url }));
}
