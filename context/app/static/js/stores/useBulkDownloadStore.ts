import { create, StoreApi } from 'zustand';
import { Dataset } from 'js/components/types';

export type BulkDownloadDataset = Pick<Dataset, 'hubmap_id' | 'processing' | 'files' | 'uuid'>;

interface BulkDownloadStore {
  isOpen: boolean;
  datasets: BulkDownloadDataset[];
  open: () => void;
  close: () => void;
  reset: () => void;
  setDatasets: (datasets: BulkDownloadDataset[]) => void;
}

const storeDefinition = (set: StoreApi<BulkDownloadStore>['setState']) => ({
  isOpen: false,
  datasets: [],
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false, datasets: [] }),
  setDatasets: (datasets: BulkDownloadDataset[]) => set({ datasets }),
});

export const useBulkDownloadStore = create<BulkDownloadStore>(storeDefinition);
