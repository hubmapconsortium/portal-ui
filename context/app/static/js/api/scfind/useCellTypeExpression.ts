import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindFlaskKey, stringOrArrayToString } from './utils';

export interface GeneExpressionParams {
  geneList?: string | string[];
  datasetName: string;
  modality?: string;
}

interface GeneExpressionKeyParams extends GeneExpressionParams {
  bin?: boolean;
}

/**
 * e.g. { "MMRN1": { "0-1": 238, "1-2": 57}}
 */
type GeneExpressionBinsResponse = Record<string, Record<string, number>>;

type GeneExpressionBinKey = string | null;

export function createGeneExpressionBinKey({
  geneList,
  datasetName,
  bin,
  modality,
}: GeneExpressionKeyParams): GeneExpressionBinKey {
  const route = bin ? '/scfind/cell-type-expression-bins.json' : '/scfind/cell-type-expression.json';
  if (!geneList) {
    return null;
  }
  return createScFindFlaskKey(route, {
    gene_list: stringOrArrayToString(geneList),
    // this is weird but it is how the API works - e.g. `HBM762-RPDR-282.HBM762.RPDR.282`
    cell_type: `${datasetName.replaceAll('.', '-')}.${datasetName}`,
    ...(bin ? { bin_length: '1' } : {}),
    modality,
  });
}

export function useCellTypeExpression(params: GeneExpressionParams) {
  const key = createGeneExpressionBinKey(params);
  // TODO: Update with correct response type once the API is fixed
  return useSWR<GeneExpressionBinsResponse, unknown, GeneExpressionBinKey>(key, (url) => fetcher({ url }));
}

export default function useCellTypeExpressionBins(params: GeneExpressionParams) {
  const key = createGeneExpressionBinKey({ ...params, bin: true });
  return useSWR<GeneExpressionBinsResponse, unknown, GeneExpressionBinKey>(key, (url) => fetcher({ url }));
}
