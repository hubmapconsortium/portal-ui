import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useMemo } from 'react';
import { createScFindKey } from './utils';

interface CellTypeLabelsForCLID {
  cell_types: string[];
}

export interface CellTypeLabelsForCLIDParams {
  clid: string;
}

type CellTypeCountForTissueKey = string;

// Hook to get the complete CLID-to-label mapping from our Flask route
export function useCLIDToLabelMapping() {
  const url = '/scfind/clid-to-label-map.json';
  return useSWR<Record<string, string[]>, unknown, string>(url, (endpoint) => fetcher({ url: endpoint }));
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
  const { data: fullMapping, error, isLoading } = useCLIDToLabelMapping();

  return useMemo(() => {
    if (isLoading || error || !fullMapping) {
      return { data: undefined, error, isLoading };
    }

    const cellTypes = fullMapping[props.clid] || [];
    return {
      data: { cell_types: cellTypes } as CellTypeLabelsForCLID,
      error: undefined,
      isLoading: false,
    };
  }, [fullMapping, props.clid, error, isLoading]);
}
