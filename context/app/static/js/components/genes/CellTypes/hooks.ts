import { fetcher } from 'js/helpers/swr';
import useSWR, { SWRResponse } from 'swr';

export const useCellTypeDatasets = (cellId: string, isOpen: boolean) => {
  const datasets: SWRResponse<string[], unknown, string> = useSWR<string[]>(
    isOpen ? `/cell-types/${cellId}/details.json` : undefined,
    (url: string) => fetcher<string[]>({ url }),
  );
  return datasets;
};
