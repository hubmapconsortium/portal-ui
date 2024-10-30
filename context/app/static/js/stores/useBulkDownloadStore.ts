import { create, StoreApi } from 'zustand';
import { Dataset } from 'js/components/types';

interface BulkDownloadStore {
  isOpen: boolean;
  datasets: Dataset[];
  open: () => void;
  close: () => void;
  reset: () => void;
  setDatasets: (datasets: Dataset[]) => void;
}

const storeDefinition = (set: StoreApi<BulkDownloadStore>['setState']) => ({
  isOpen: false,
  datasets: [],
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false, datasets: [] }),
  setDatasets: (datasets: Dataset[]) => set({ datasets }),
});

export const useBulkDownloadStore = create<BulkDownloadStore>(storeDefinition);
