import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';

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
  scFindIndexVersion?: string,
): HyperQueryCellTypesKey {
  return createScFindKey(
    scFindEndpoint,
    'hyperQueryCellTypes',
    {
      gene_list: stringOrArrayToString(geneList),
      dataset_name: datasetName ? stringOrArrayToString(datasetName) : undefined,
      include_prefix: includePrefix ? 'true' : 'false',
    },
    scFindIndexVersion,
  );
}

export default function useHyperQueryCellTypes(params: HyperQueryCellTypesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCellTypeNamesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<CellTypeNamesResponse, unknown, HyperQueryCellTypesKey>(key, (url) => fetcher({ url }));
}
