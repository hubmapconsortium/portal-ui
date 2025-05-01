import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

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
): CellTypeCountForTissueKey {
  return createScFindKey(scFindEndpoint, 'cellTypeCountForTissue', {
    CLID_label: clid,
  });
}

export default function useCLIDToLabel(props: CellTypeLabelsForCLIDParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createCLIDtoLabelKey(scFindEndpoint, props);
  return useSWR<CellTypeLabelsForCLID, unknown, CellTypeCountForTissueKey>(key, (url) => fetcher({ url }));
}
