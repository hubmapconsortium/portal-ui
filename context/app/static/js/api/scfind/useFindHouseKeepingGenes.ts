import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';

export interface FindHouseKeepingGenesParams {
  cellTypes?: string | string[];
  minRecall?: number;
  maxGenes?: number;
}

type FindHouseKeepingGenesKey = string;

interface FindHouseKeepingGenesResponse {
  findHouseKeepingGenes: unknown;
}

export function createFindHouseKeepingGenesKey(
  scFindEndpoint: string,
  { cellTypes, minRecall, maxGenes }: FindHouseKeepingGenesParams,
  scFindIndexVersion?: string,
): FindHouseKeepingGenesKey {
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
  return useSWR<FindHouseKeepingGenesResponse, unknown, FindHouseKeepingGenesKey>(key, (url) => fetcher({ url }));
}
