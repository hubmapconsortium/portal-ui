import { create, StoreApi } from 'zustand';

/**
 * Tracks which files are selected for transfer, keyed by the dataset they belong to.
 *
 * Selection here is *file*-level, and a dataset row can be partially selected, so this does not
 * use `SelectableTableProvider`: its `SelectableRowCell` renders a plain two-state checkbox and its
 * store holds a flat set of row keys.
 *
 * A dataset is represented one of two ways, which the UI must distinguish:
 *
 * - **whole**: every file in the dataset, including ones not on the current page or not matching
 *   the active filters. Emitted to a manifest as a single directory line, so the file list never
 *   has to be enumerated.
 * - **partial**: an explicit set of `rel_path`s, chosen in the file-selection modal or added in
 *   bulk by "add all matching files".
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
  /**
   * HuBMAP ID per selected dataset uuid, recorded at selection time.
   *
   * The manifest needs an ID for every selected dataset, and "add all matching files" selects
   * datasets that were never rendered, so the IDs cannot be recovered from the loaded rows.
   */
  hubmapIds: Map<string, string>;
  toggleWholeDataset: (datasetUuid: string, hubmapId: string) => void;
  toggleFile: (datasetUuid: string, hubmapId: string, relPath: string) => void;
  setDatasetFiles: (datasetUuid: string, hubmapId: string, relPaths: string[]) => void;
  /** Replaces the selection with the given datasets and their files, in one update. */
  addFiles: (byDataset: Map<string, { hubmapId: string; relPaths: string[] }>) => void;
  clearDataset: (datasetUuid: string) => void;
  clearDatasets: (datasetUuids: string[]) => void;
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
  hubmapIds: new Map<string, string>(),

  toggleWholeDataset: (datasetUuid: string, hubmapId: string) => {
    const { wholeDatasets, selectedFiles, hubmapIds } = get();
    const next = new Set(wholeDatasets);
    if (next.has(datasetUuid)) {
      next.delete(datasetUuid);
    } else {
      next.add(datasetUuid);
    }
    // Whole and partial selection are mutually exclusive.
    set({
      wholeDatasets: next,
      selectedFiles: withoutDataset(selectedFiles, datasetUuid),
      hubmapIds: new Map(hubmapIds).set(datasetUuid, hubmapId),
    });
  },

  toggleFile: (datasetUuid: string, hubmapId: string, relPath: string) => {
    const { wholeDatasets, selectedFiles, hubmapIds } = get();
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
    set({
      wholeDatasets: nextWhole,
      selectedFiles: nextFiles,
      hubmapIds: new Map(hubmapIds).set(datasetUuid, hubmapId),
    });
  },

  setDatasetFiles: (datasetUuid: string, hubmapId: string, relPaths: string[]) => {
    const { wholeDatasets, selectedFiles, hubmapIds } = get();
    const nextFiles = new Map(selectedFiles);
    if (relPaths.length === 0) {
      nextFiles.delete(datasetUuid);
    } else {
      nextFiles.set(datasetUuid, new Set(relPaths));
    }
    const nextWhole = new Set(wholeDatasets);
    nextWhole.delete(datasetUuid);
    set({
      wholeDatasets: nextWhole,
      selectedFiles: nextFiles,
      hubmapIds: new Map(hubmapIds).set(datasetUuid, hubmapId),
    });
  },

  addFiles: (byDataset: Map<string, { hubmapId: string; relPaths: string[] }>) => {
    const { wholeDatasets, selectedFiles, hubmapIds } = get();
    const nextFiles = new Map(selectedFiles);
    const nextWhole = new Set(wholeDatasets);
    const nextIds = new Map(hubmapIds);

    byDataset.forEach(({ hubmapId, relPaths }, datasetUuid) => {
      if (relPaths.length === 0) return;
      // A dataset already selected in full stays that way: it is a superset of any file list, and
      // its single manifest line is cheaper than enumerating.
      if (nextWhole.has(datasetUuid)) {
        nextIds.set(datasetUuid, hubmapId);
        return;
      }
      const merged = new Set(nextFiles.get(datasetUuid) ?? []);
      relPaths.forEach((relPath) => merged.add(relPath));
      nextFiles.set(datasetUuid, merged);
      nextIds.set(datasetUuid, hubmapId);
    });

    set({ wholeDatasets: nextWhole, selectedFiles: nextFiles, hubmapIds: nextIds });
  },

  clearDataset: (datasetUuid: string) => {
    get().clearDatasets([datasetUuid]);
  },

  clearDatasets: (datasetUuids: string[]) => {
    const { wholeDatasets, selectedFiles, hubmapIds } = get();
    const nextWhole = new Set(wholeDatasets);
    const nextFiles = new Map(selectedFiles);
    const nextIds = new Map(hubmapIds);
    datasetUuids.forEach((uuid) => {
      nextWhole.delete(uuid);
      nextFiles.delete(uuid);
      nextIds.delete(uuid);
    });
    set({ wholeDatasets: nextWhole, selectedFiles: nextFiles, hubmapIds: nextIds });
  },

  clearAll: () => {
    set({
      wholeDatasets: new Set<string>(),
      selectedFiles: new Map<string, Set<string>>(),
      hubmapIds: new Map<string, string>(),
    });
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
