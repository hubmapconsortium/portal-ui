import create from 'zustand';

export type FileDisplayOption = 'all' | 'qa/qc' | 'data products';

export interface FilesStore {
  filesToDisplay: FileDisplayOption;
  toggleDisplayOnlyQaQc: () => void;
  toggleDisplayOnlyDataProducts: () => void;
}

const useFilesStore = create<FilesStore>((set) => ({
  filesToDisplay: 'all',
  toggleDisplayOnlyQaQc: () =>
    set((state) => ({
      filesToDisplay: state.filesToDisplay !== 'qa/qc' ? 'qa/qc' : 'all',
    })),
  toggleDisplayOnlyDataProducts: () =>
    set((state) => ({
      filesToDisplay: state.filesToDisplay !== 'data products' ? 'data products' : 'all',
    })),
}));

export default useFilesStore;
