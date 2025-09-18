import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useMemo } from 'react';
import { createScFindKey } from './utils';

export interface CellTypeLabelsForCLIDParams {
  clid: string;
}

type CellTypeCountForTissueKey = string;

// Hook to get the complete CLID-to-label mapping from our Flask route
export function useCLIDToLabelMapping() {
  const path = '/scfind/clid-to-label-map.json';
  return useSWR<Record<string, string[]>, unknown, string>(path, (endpoint) => fetcher({ url: endpoint }));
}

// Legacy function for direct SCFIND API calls - kept for backward compatibility
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
  const { data: fullMapping, error, isLoading, ...rest } = useCLIDToLabelMapping();

  const cellTypes = useMemo(() => {
    if (isLoading || error || !fullMapping) {
      return undefined;
    }

    return fullMapping[props.clid] || [];
  }, [fullMapping, props.clid, error, isLoading]);

  return { data: cellTypes, error, isLoading, ...rest };
}
