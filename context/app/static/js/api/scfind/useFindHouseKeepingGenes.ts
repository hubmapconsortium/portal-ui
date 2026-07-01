import useSWR from 'swr';
import {
  cellTypeNameContainsComma,
  createScFindFlaskKey,
  createScFindFlaskPostRequest,
  ScFindRequest,
  scFindFetcher,
  stringOrArrayToString,
  toArray,
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

export function createFindHouseKeepingGenesKey({
  cellTypes,
  minRecall,
  maxGenes,
}: FindHouseKeepingGenesParams): FindHouseKeepingGenesKey {
  if (cellTypeNameContainsComma(cellTypes)) {
    return createScFindFlaskPostRequest('/scfind/find-housekeeping-genes.json', {
      cell_types: toArray(cellTypes),
      min_recall: minRecall,
      max_genes: maxGenes,
    });
  }
  return createScFindFlaskKey('/scfind/find-housekeeping-genes.json', {
    cell_types: cellTypes ? stringOrArrayToString(cellTypes) : undefined,
    min_recall: minRecall ? String(minRecall) : undefined,
    max_genes: maxGenes ? String(maxGenes) : undefined,
  });
}

export default function useFindHouseKeepingGenes(params: FindHouseKeepingGenesParams) {
  const key = createFindHouseKeepingGenesKey(params);
  return useSWR<FindHouseKeepingGenesResponse, unknown, FindHouseKeepingGenesKey>(key, scFindFetcher);
}
