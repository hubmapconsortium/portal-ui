import useSWR, { SWRConfiguration } from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';

export interface HyperQueryCellTypesParams {
  geneList: string | string[];
  organName?: string | string[];
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
  { geneList, organName, includePrefix }: HyperQueryCellTypesParams,
  scFindIndexVersion?: string,
): HyperQueryCellTypesKey {
  return createScFindKey(
    scFindEndpoint,
    'hyperQueryCellTypes',
    {
      gene_list: stringOrArrayToString(geneList),
      // The API parameter is `dataset_name` but the actual expected values are organ names
      // because these calculations are run either across all datasets, or all datasets of a specific organ.
      dataset_name: organName ? stringOrArrayToString(organName) : undefined,
      include_prefix: includePrefix ? 'true' : 'false',
    },
    scFindIndexVersion,
  );
}

export default function useHyperQueryCellTypes(params: HyperQueryCellTypesParams, swrConfig?: SWRConfiguration) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCellTypeNamesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<CellTypeNamesResponse, unknown, HyperQueryCellTypesKey>(key, (url) => fetcher({ url }), swrConfig);
}
