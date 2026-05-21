import useSWR from 'swr';
import {
  cellTypeNameContainsComma,
  createScFindKey,
  createScFindPostRequest,
  ScFindRequest,
  scFindFetcher,
  stringOrArrayToString,
  toArray,
  useScFindKey,
} from './utils';

export interface FindHouseKeepingGenesParams {
  cellTypes?: string | string[];
  minRecall?: number;
  maxGenes?: number;
}

type FindHouseKeepingGenesKey = ScFindRequest;

interface FindHouseKeepingGenesResponse {
  findHouseKeepingGenes: unknown;
}

export function createFindHouseKeepingGenesKey(
  scFindEndpoint: string,
  { cellTypes, minRecall, maxGenes }: FindHouseKeepingGenesParams,
  scFindIndexVersion?: string,
): FindHouseKeepingGenesKey {
  if (cellTypeNameContainsComma(cellTypes)) {
    return createScFindPostRequest(
      scFindEndpoint,
      'findHouseKeepingGenes',
      {
        cell_types: toArray(cellTypes),
        min_recall: minRecall,
        max_genes: maxGenes,
      },
      scFindIndexVersion,
    );
  }
  return createScFindKey(
    scFindEndpoint,
    'findHouseKeepingGenes',
    {
      cell_types: cellTypes ? stringOrArrayToString(cellTypes) : undefined,
      min_recall: minRecall ? String(minRecall) : undefined,
      max_genes: maxGenes ? String(maxGenes) : undefined,
    },
    scFindIndexVersion,
  );
}

export default function useFindHouseKeepingGenes(params: FindHouseKeepingGenesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createFindHouseKeepingGenesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<FindHouseKeepingGenesResponse, unknown, FindHouseKeepingGenesKey>(key, scFindFetcher);
}
