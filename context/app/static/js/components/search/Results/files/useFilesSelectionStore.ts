import { create, StoreApi } from 'zustand';

/**
 * Tracks which files are selected for transfer, keyed by the dataset they belong to.
 *
 * Selection here is *file*-level, and a dataset row can be partially selected, so this does
 * not use `SelectableTableProvider`: its `SelectableRowCell` renders a plain two-state
 * checkbox and its store holds a flat set of row keys.
 *
 * A dataset is represented one of two ways, which the UI must distinguish:
 *
 * - **whole**: every file in the dataset, including ones not on the current page or not
 *   matching the active filters. Emitted to a manifest as a single directory line, so the
 *   file list never has to be enumerated.
 * - **partial**: an explicit set of `rel_path`s chosen in the file-selection modal.
 *
 * The two are mutually exclusive per dataset; selecting a whole dataset clears its partial
 * selection and vice versa.
 */
export type DatasetSelectionState = 'none' | 'partial' | 'whole';

interface FilesSelectionStore {
  /** Datasets selected in their entirety. */
  wholeDatasets: Set<string>;
  /** Explicitly chosen files, by dataset uuid. Never holds an empty set. */
  selectedFiles: Map<string, Set<string>>;
  toggleWholeDataset: (datasetUuid: string) => void;
  toggleFile: (datasetUuid: string, relPath: string) => void;
  setDatasetFiles: (datasetUuid: string, relPaths: string[]) => void;
  clearDataset: (datasetUuid: string) => void;
  clearAll: () => void;
}

function withoutDataset(map: Map<string, Set<string>>, datasetUuid: string) {
  const next = new Map(map);
  next.delete(datasetUuid);
  return next;
}

const storeDefinition = (
  set: StoreApi<FilesSelectionStore>['setState'],
  get: StoreApi<FilesSelectionStore>['getState'],
) => ({
  wholeDatasets: new Set<string>(),
  selectedFiles: new Map<string, Set<string>>(),

  toggleWholeDataset: (datasetUuid: string) => {
    const { wholeDatasets, selectedFiles } = get();
    const next = new Set(wholeDatasets);
    if (next.has(datasetUuid)) {
      next.delete(datasetUuid);
    } else {
      next.add(datasetUuid);
    }
    // Whole and partial selection are mutually exclusive.
    set({ wholeDatasets: next, selectedFiles: withoutDataset(selectedFiles, datasetUuid) });
  },

  toggleFile: (datasetUuid: string, relPath: string) => {
    const { wholeDatasets, selectedFiles } = get();
    const nextFiles = new Map(selectedFiles);
    const current = new Set(nextFiles.get(datasetUuid) ?? []);

    if (current.has(relPath)) {
      current.delete(relPath);
    } else {
      current.add(relPath);
    }

    if (current.size === 0) {
      nextFiles.delete(datasetUuid);
    } else {
      nextFiles.set(datasetUuid, current);
    }

    const nextWhole = new Set(wholeDatasets);
    nextWhole.delete(datasetUuid);
    set({ wholeDatasets: nextWhole, selectedFiles: nextFiles });
  },

  setDatasetFiles: (datasetUuid: string, relPaths: string[]) => {
    const { wholeDatasets, selectedFiles } = get();
    const nextFiles = new Map(selectedFiles);
    if (relPaths.length === 0) {
      nextFiles.delete(datasetUuid);
    } else {
      nextFiles.set(datasetUuid, new Set(relPaths));
    }
    const nextWhole = new Set(wholeDatasets);
    nextWhole.delete(datasetUuid);
    set({ wholeDatasets: nextWhole, selectedFiles: nextFiles });
  },

  clearDataset: (datasetUuid: string) => {
    const { wholeDatasets, selectedFiles } = get();
    const nextWhole = new Set(wholeDatasets);
    nextWhole.delete(datasetUuid);
    set({ wholeDatasets: nextWhole, selectedFiles: withoutDataset(selectedFiles, datasetUuid) });
  },

  clearAll: () => {
    set({ wholeDatasets: new Set<string>(), selectedFiles: new Map<string, Set<string>>() });
  },
});

export const useFilesSelectionStore = create<FilesSelectionStore>(storeDefinition);

/** Checkbox state for one dataset row: unchecked, indeterminate, or checked. */
export function getDatasetSelectionState(
  datasetUuid: string,
  wholeDatasets: Set<string>,
  selectedFiles: Map<string, Set<string>>,
): DatasetSelectionState {
  if (wholeDatasets.has(datasetUuid)) {
    return 'whole';
  }
  return selectedFiles.has(datasetUuid) ? 'partial' : 'none';
}

/** Number of datasets with any selection, for the "N selected" header. */
export function countSelectedDatasets(wholeDatasets: Set<string>, selectedFiles: Map<string, Set<string>>): number {
  return new Set([...wholeDatasets, ...selectedFiles.keys()]).size;
}
