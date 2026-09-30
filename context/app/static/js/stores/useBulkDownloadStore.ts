import { create, StoreApi } from 'zustand';
import { Dataset } from 'js/components/types';

export type BulkDownloadDataset = Pick<Dataset, 'hubmap_id' | 'processing' | 'files' | 'uuid' | 'processing_type'>;

/**
 * File-level selection, for callers that pick individual files rather than whole datasets.
 *
 * Only the files search populates this. Every other caller opens the dialog with dataset uuids
 * alone, which continues to mean "everything in these datasets".
 */
export interface BulkDownloadFileSelection {
  /** Chosen `rel_path`s by dataset uuid. */
  selectedFilesByDataset: Map<string, Set<string>>;
  /** Overrides the analytics category so files-search downloads are attributable. */
  analyticsCategory?: string;
}

interface BulkDownloadStore extends Partial<BulkDownloadFileSelection> {
  downloadSuccess: boolean;
  isOpen: boolean;
  /** Datasets to download in full. */
  uuids: Set<string>;
  setDownloadSuccess: (success: boolean) => void;
  open: () => void;
  close: () => void;
  setUuids: (uuids: Set<string>) => void;
  setSelectedFilesByDataset: (selectedFilesByDataset: Map<string, Set<string>>) => void;
  openDialog: (uuids: Set<string>, fileSelection?: BulkDownloadFileSelection) => void;
}

const storeDefinition = (set: StoreApi<BulkDownloadStore>['setState']) => ({
  downloadSuccess: false,
  isOpen: false,
  uuids: new Set<string>(),
  selectedFilesByDataset: undefined,
  analyticsCategory: undefined,
  setDownloadSuccess: (downloadSuccess: boolean) => {
    set({ downloadSuccess });
  },
  open: () => {
    set({ isOpen: true });
  },
  close: () => {
    // Clear the file selection: unlike `uuids` (which callers re-supply on every open), a stale
    // file selection would silently join the next download.
    set({ isOpen: false, selectedFilesByDataset: undefined, analyticsCategory: undefined });
  },
  setUuids: (uuids: Set<string>) => {
    set({ uuids });
  },
  setSelectedFilesByDataset: (selectedFilesByDataset: Map<string, Set<string>>) => {
    set({ selectedFilesByDataset });
  },
  openDialog: (uuids: Set<string>, fileSelection?: BulkDownloadFileSelection) => {
    set({
      uuids,
      isOpen: true,
      selectedFilesByDataset: fileSelection?.selectedFilesByDataset,
      analyticsCategory: fileSelection?.analyticsCategory,
    });
  },
});

export const useBulkDownloadStore = create<BulkDownloadStore>(storeDefinition);
