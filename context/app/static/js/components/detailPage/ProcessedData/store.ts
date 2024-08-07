import { create } from 'zustand';
import { ProcessedDatasetDetails } from './ProcessedDataset/hooks';

/**
 * Store for tracking which datasets have been seen and which dataset is currently being viewed.
 * The set of seen datasets is used to determine whether the vitessce visualization for that dataset should be displayed.
 * The current dataset is used to display info in the helper panel.
 */
interface ProcessedDataStoreState {
  seenDatasets: Set<string>;
  currentDataset: ProcessedDatasetDetails | null;
}

interface ProcessedDataStoreAction {
  addDataset: (hubmapId: string) => void;
  setCurrentDataset: (dataset: ProcessedDatasetDetails) => void;
  hasBeenSeen: (hubmapId: string) => boolean;
}

const defaultState = {
  seenDatasets: new Set<string>(),
  currentDataset: null,
  datasetOffsets: new Map<string, number>(),
  currentDatasetOffset: 0,
};

export type ProcessedDataStore = ProcessedDataStoreState & ProcessedDataStoreAction;

export const useProcessedDataStore = create<ProcessedDataStore>((set, get) => ({
  ...defaultState,
  addDataset: (hubmapId) => set((state) => ({ seenDatasets: new Set([...state.seenDatasets, hubmapId]) })),
  setCurrentDataset: (dataset) => {
    const { addDataset } = get();
    addDataset(dataset.hubmap_id);
    set({ currentDataset: dataset });
  },
  hasBeenSeen: (hubmapId) => Boolean(get().seenDatasets.has(hubmapId)),
}));
export default useProcessedDataStore;
