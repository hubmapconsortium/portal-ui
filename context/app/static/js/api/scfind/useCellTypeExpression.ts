import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';

export interface GeneExpressionParams {
  geneList?: string | string[];
  datasetName: string;
}

interface GeneExpressionKeyParams extends GeneExpressionParams {
  bin?: boolean;
}

/**
 * e.g. { "MMRN1": { "0-1": 238, "1-2": 57}}
 */
type GeneExpressionBinsResponse = Record<string, Record<string, number>>;

type GeneExpressionBinKey = string | null;

export function createGeneExpressionBinKey(
  scFindEndpoint: string,
  { geneList, datasetName, bin }: GeneExpressionKeyParams,
  scFindIndexVersion?: string,
): GeneExpressionBinKey {
  const base = bin ? 'getCellTypeExpressionBinData' : 'getCellTypeExpression';
  if (!geneList) {
    return null;
  }
  return createScFindKey(
    scFindEndpoint,
    base,
    {
      gene_list: stringOrArrayToString(geneList),
      // this is weird but it is how the API works - e.g. `HBM762-RPDR-282.HBM762.RPDR.282`
      cell_type: `${datasetName.replaceAll('.', '-')}.${datasetName}`,
      ...(bin ? { bin_length: '1' } : {}),
    },
    scFindIndexVersion,
  );
}

export function useCellTypeExpression(params: GeneExpressionParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createGeneExpressionBinKey(scFindEndpoint, params, scFindIndexVersion);
  // TODO: Update with correct response type once the API is fixed
  return useSWR<GeneExpressionBinsResponse, unknown, GeneExpressionBinKey>(key, (url) => fetcher({ url }));
}

export default function useCellTypeExpressionBins(params: GeneExpressionParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createGeneExpressionBinKey(scFindEndpoint, { ...params, bin: true }, scFindIndexVersion);
  return useSWR<GeneExpressionBinsResponse, unknown, GeneExpressionBinKey>(key, (url) => fetcher({ url }));
}
