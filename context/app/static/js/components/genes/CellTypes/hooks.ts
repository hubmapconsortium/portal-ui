import { fetcher } from 'js/helpers/swr';
import useSWR from 'swr';

export const useCellTypeDatasets = (cellId: string, isOpen: boolean) => {
  const datasets = useSWR<string[]>(isOpen ? `/cell-types/${cellId}/datasets.json` : undefined, (url: string) =>
    fetcher({ url }),
  );
  return datasets;
};
