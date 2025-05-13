import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

interface CellTypeToCLID {
  CLIDs: string[];
}

export interface CellTypeToCLIDParams {
  cellType: string;
}

type CellTypeToCLIDKey = string;

export function createCLIDtoLabelKey(scFindEndpoint: string, { cellType }: CellTypeToCLIDParams): CellTypeToCLIDKey {
  return createScFindKey(scFindEndpoint, 'CellType2CLID', {
    cell_type: cellType,
  });
}

export default function useLabelToCLID(props: CellTypeToCLIDParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createCLIDtoLabelKey(scFindEndpoint, props);
  return useSWR<CellTypeToCLID, unknown, CellTypeToCLIDKey>(key, (url) => fetcher({ url }));
}
