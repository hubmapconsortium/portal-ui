import { ProcessedDatasetTypes } from 'js/pages/Dataset/hooks';
import { create } from 'zustand';

interface ProcessedDataStoreState {
  seenDatasets: Set<string>;
  currentDataset: ProcessedDatasetTypes | null;
  datasetOffsets: Map<string, number>;
  currentDatasetOffset: number;
}

interface ProcessedDataStoreAction {
  addDataset: (hubmapId: string) => void;
  setCurrentDataset: (dataset: ProcessedDatasetTypes) => void;
  hasBeenSeen: (hubmapId: string) => boolean;
  setDatasetOffset: (hubmapId: string, offset: number) => void;
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
    const { datasetOffsets, addDataset } = get();
    addDataset(dataset.hubmap_id);
    set({ currentDataset: dataset, currentDatasetOffset: datasetOffsets.get(dataset.hubmap_id) ?? 0 });
  },
  hasBeenSeen: (hubmapId) => Boolean(get().seenDatasets.has(hubmapId)),
  setDatasetOffset: (hubmapId, offset) =>
    set((state) => ({ datasetOffsets: new Map(state.datasetOffsets.set(hubmapId, offset)) })),
}));
export default useProcessedDataStore;
