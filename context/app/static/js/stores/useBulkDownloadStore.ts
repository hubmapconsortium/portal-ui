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
  selectedFiles: Map<string, Set<string>>;
  /**
   * HuBMAP ID per dataset uuid.
   *
   * Supplied by the caller because a selection can include datasets the dialog never fetches --
   * "add all matching files" selects across the whole result set, not just the rendered page.
   */
  hubmapIdsByUuid: Map<string, string>;
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
  setSelectedFiles: (selectedFiles: Map<string, Set<string>>) => void;
  openDialog: (uuids: Set<string>, fileSelection?: BulkDownloadFileSelection) => void;
}

const storeDefinition = (set: StoreApi<BulkDownloadStore>['setState']) => ({
  downloadSuccess: false,
  isOpen: false,
  uuids: new Set<string>(),
  selectedFiles: undefined,
  hubmapIdsByUuid: undefined,
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
    set({ isOpen: false, selectedFiles: undefined, hubmapIdsByUuid: undefined, analyticsCategory: undefined });
  },
  setUuids: (uuids: Set<string>) => {
    set({ uuids });
  },
  setSelectedFiles: (selectedFiles: Map<string, Set<string>>) => {
    set({ selectedFiles });
  },
  openDialog: (uuids: Set<string>, fileSelection?: BulkDownloadFileSelection) => {
    set({
      uuids,
      isOpen: true,
      selectedFiles: fileSelection?.selectedFiles,
      hubmapIdsByUuid: fileSelection?.hubmapIdsByUuid,
      analyticsCategory: fileSelection?.analyticsCategory,
    });
  },
});

export const useBulkDownloadStore = create<BulkDownloadStore>(storeDefinition);
