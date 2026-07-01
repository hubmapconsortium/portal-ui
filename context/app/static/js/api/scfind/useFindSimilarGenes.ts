import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindFlaskKey, stringOrArrayToString } from './utils';

export interface FindSimilarGenesParams {
  geneList: string | string[];
  datasetName: string | string[];
  topK?: number;
}

type FindSimilarGenesKey = string;

interface FindSimilarGenesResponse {
  evaluateMarkers: unknown;
}

export function createFindSimilarGenesKey({
  geneList,
  datasetName,
  topK,
}: FindSimilarGenesParams): FindSimilarGenesKey {
  return createScFindFlaskKey('/scfind/find-similar-genes.json', {
    gene_list: stringOrArrayToString(geneList),
    dataset_name: stringOrArrayToString(datasetName),
    top_k: topK ? topK.toString() : undefined,
  });
}

export default function useFindSimilarGenes(params: FindSimilarGenesParams) {
  const key = createFindSimilarGenesKey(params);
  return useSWR<FindSimilarGenesResponse, unknown, FindSimilarGenesKey>(key, (url) => fetcher({ url }));
}
