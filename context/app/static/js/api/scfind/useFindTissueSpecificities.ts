import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

export interface FindTissueSpecificitiesParams {
  geneList?: string | string[];
  minCells?: number;
}

type FindTissueSpecificitiesKey = string;

interface FindTissueSpecificitiesResponse {
  evaluateMarkers: unknown;
}

export function FindTissueSpecificitiesKey(
  scFindEndpoint: string,
  { geneList, minCells }: FindTissueSpecificitiesParams,
  scFindIndexVersion?: string,
): FindTissueSpecificitiesKey {
  return createScFindKey(
    scFindEndpoint,
    'findTissueSpecificities',
    {
      gene_list: Array.isArray(geneList) ? geneList.join(',') : geneList,
      min_cells: minCells ? String(minCells) : undefined,
    },
    scFindIndexVersion,
  );
}

export default function useFindTissueSpecificities(params: FindTissueSpecificitiesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  const key = FindTissueSpecificitiesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<FindTissueSpecificitiesResponse, unknown, FindTissueSpecificitiesKey>(key, (url) => fetcher({ url }));
}
