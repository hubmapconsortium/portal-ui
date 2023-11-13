import { fetcher } from 'js/helpers/swr';
import useSWR from 'swr';

interface CellTypeDataset {
  uuid: string;
  hubmap_id: string;
  mapped_data_types: string[];
  origin_samples_unique_mapped_organs: string[];
  last_modified_timestamp: number;
  group_name: string;
}

export const useCellTypeDatasets = (cellId: string, isOpen: boolean) => {
  const datasets = useSWR<CellTypeDataset[]>(
    isOpen ? `/cell-types/${cellId}/datasets.json` : undefined,
    (url: string) => fetcher({ url }),
  );
  return datasets;
};
