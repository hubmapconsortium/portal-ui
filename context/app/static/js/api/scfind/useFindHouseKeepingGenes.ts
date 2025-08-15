import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

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
      cell_types: Array.isArray(cellTypes) ? cellTypes.join(',') : cellTypes,
      min_recall: minRecall ? String(minRecall) : undefined,
      max_genes: maxGenes ? String(maxGenes) : undefined,
    },
    scFindIndexVersion,
  );
}

export default function useFindHouseKeepingGenes(params: FindHouseKeepingGenesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  const key = createFindHouseKeepingGenesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<FindHouseKeepingGenesResponse, unknown, FindHouseKeepingGenesKey>(key, (url) => fetcher({ url }));
}
