import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, useScFindKey } from './utils';

interface CellTypeLabelsForCLID {
  cell_types: string[];
}

export interface CellTypeLabelsForCLIDParams {
  clid: string;
}

type CellTypeCountForTissueKey = string;

export function createCLIDtoLabelKey(
  scFindEndpoint: string,
  { clid }: CellTypeLabelsForCLIDParams,
  scFindIndexVersion?: string,
): CellTypeCountForTissueKey {
  return createScFindKey(
    scFindEndpoint,
    'CLID2CellType',
    {
      CLID_label: clid,
    },
    scFindIndexVersion,
  );
}

export default function useCLIDToLabel(props: CellTypeLabelsForCLIDParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCLIDtoLabelKey(scFindEndpoint, props, scFindIndexVersion);
  return useSWR<CellTypeLabelsForCLID, unknown, CellTypeCountForTissueKey>(key, (url) => fetcher({ url }));
}
