import useSWR, { SWRConfiguration } from 'swr';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';
import { useMemo } from 'react';

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
  { geneList, organName, includePrefix = true }: HyperQueryCellTypesParams,
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

/**
 * Hook that makes separate hyperquery requests for each gene and combines the results.
 * This allows for proper tracking of which cell types are associated with which genes.
 */
export function useMultiGeneHyperQueryCellTypes(
  params: Omit<HyperQueryCellTypesParams, 'geneList'> & { genes: string[] },
  swrConfig?: SWRConfiguration,
) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();

  // Create separate SWR keys for each gene
  const urls = useMemo(() => {
    return params.genes.map((gene) =>
      createCellTypeNamesKey(scFindEndpoint, { ...params, geneList: gene }, scFindIndexVersion),
    );
  }, [scFindEndpoint, params, scFindIndexVersion]);

  // Use SWR with multiFetcher to fetch all gene queries at once and combine results
  return useSWR<Record<string, GeneSignatureStats[]>, unknown, string[] | null>(
    urls.length > 0 ? urls : null,
    (fetchUrls) =>
      fetchUrls
        ? multiFetcher<CellTypeNamesResponse>({ urls: fetchUrls }).then((data) => {
            const geneResults: Record<string, GeneSignatureStats[]> = {};

            if (data) {
              params.genes.forEach((gene, index) => {
                const geneData = data[index];
                if (geneData?.findGeneSignatures) {
                  geneResults[gene] = geneData.findGeneSignatures;
                } else {
                  geneResults[gene] = [];
                }
              });
            } else {
              // Initialize empty results for all genes
              params.genes.forEach((gene) => {
                geneResults[gene] = [];
              });
            }
            return geneResults;
          })
        : Promise.resolve({}),
    swrConfig,
  );
}
