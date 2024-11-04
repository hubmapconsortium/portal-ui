import { create, StoreApi } from 'zustand';
import { Dataset } from 'js/components/types';

export type BulkDownloadDataset = Pick<Dataset, 'hubmap_id' | 'processing' | 'files' | 'uuid'>;

interface BulkDownloadStore {
  isOpen: boolean;
  uuids: Set<string>;
  open: () => void;
  close: () => void;
  reset: () => void;
  setUuids: (uuids: Set<string>) => void;
}

const storeDefinition = (set: StoreApi<BulkDownloadStore>['setState']) => ({
  isOpen: false,
  uuids: new Set<string>(),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false, uuids: new Set<string>() }),
  setUuids: (uuids: Set<string>) => set({ uuids }),
});

export const useBulkDownloadStore = create<BulkDownloadStore>(storeDefinition);
