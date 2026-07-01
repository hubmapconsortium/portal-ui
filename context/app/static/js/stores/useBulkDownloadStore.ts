import { create, StoreApi } from 'zustand';
import { Dataset } from 'js/components/types';

export type BulkDownloadDataset = Pick<Dataset, 'hubmap_id' | 'processing' | 'files' | 'uuid' | 'processing_type'>;

interface BulkDownloadStore {
  downloadSuccess: boolean;
  isOpen: boolean;
  uuids: Set<string>;
  setDownloadSuccess: (success: boolean) => void;
  open: () => void;
  close: () => void;
  setUuids: (uuids: Set<string>) => void;
  openDialog: (uuids: Set<string>) => void;
}

const storeDefinition = (set: StoreApi<BulkDownloadStore>['setState']) => ({
  downloadSuccess: false,
  isOpen: false,
  uuids: new Set<string>(),
  setDownloadSuccess: (downloadSuccess: boolean) => {
    set({ downloadSuccess });
  },
  open: () => {
    set({ isOpen: true });
  },
  close: () => {
    set({ isOpen: false });
  },
  setUuids: (uuids: Set<string>) => {
    set({ uuids });
  },
  openDialog: (uuids: Set<string>) => {
    set({ uuids, isOpen: true });
  },
});

export const useBulkDownloadStore = create<BulkDownloadStore>(storeDefinition);
