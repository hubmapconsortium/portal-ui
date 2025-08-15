import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey, stringOrArrayToString } from './utils';

export interface FindSimilarGenesParams {
  geneList: string | string[];
  datasetName: string | string[];
  topK?: number;
}

type FindSimilarGenesKey = string;

interface FindSimilarGenesResponse {
  evaluateMarkers: unknown;
}

export function createFindSimilarGenesKey(
  scFindEndpoint: string,
  { geneList, datasetName, topK }: FindSimilarGenesParams,
  scFindIndexVersion?: string,
): FindSimilarGenesKey {
  return createScFindKey(
    scFindEndpoint,
    'findSimilarGenes',
    {
      gene_list: stringOrArrayToString(geneList),
      dataset_name: stringOrArrayToString(datasetName),
      top_k: topK ? topK.toString() : undefined,
    },
    scFindIndexVersion,
  );
}

export default function useFindSimilarGenes(params: FindSimilarGenesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  const key = createFindSimilarGenesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<FindSimilarGenesResponse, unknown, FindSimilarGenesKey>(key, (url) => fetcher({ url }));
}
