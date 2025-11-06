import { create } from 'zustand';

export type FileDisplayOption = 'all' | 'qa/qc' | 'data products' | 'both';
export type FileFilter = 'qa/qc' | 'data products';

export interface FilesStore {
  filesToDisplay: FileDisplayOption;
  selectedFileFilters: FileFilter[];
  toggleFileFilter: (filter: FileFilter) => void;
  // Legacy methods for backward compatibility
  toggleDisplayOnlyQaQc: () => void;
  toggleDisplayOnlyDataProducts: () => void;
}

const useFilesStore = create<FilesStore>((set) => ({
  filesToDisplay: 'all',
  selectedFileFilters: [],
  toggleFileFilter: (filter: FileFilter) => {
    set((state) => {
      const isSelected = state.selectedFileFilters.includes(filter);
      const newFilters = isSelected
        ? state.selectedFileFilters.filter((f) => f !== filter)
        : [...state.selectedFileFilters, filter];

      // Determine the display option based on selected filters
      let filesToDisplay: FileDisplayOption = 'all';
      if (newFilters.length === 1) {
        filesToDisplay = newFilters[0];
      } else if (newFilters.length > 1) {
        filesToDisplay = 'both';
      }

      return {
        selectedFileFilters: newFilters,
        filesToDisplay,
      };
    });
  },
  // Legacy methods for backward compatibility
  toggleDisplayOnlyQaQc: () => {
    set((state) => ({
      filesToDisplay: state.filesToDisplay !== 'qa/qc' ? 'qa/qc' : 'all',
      selectedFileFilters: state.filesToDisplay !== 'qa/qc' ? ['qa/qc'] : [],
    }));
  },
  toggleDisplayOnlyDataProducts: () => {
    set((state) => ({
      filesToDisplay: state.filesToDisplay !== 'data products' ? 'data products' : 'all',
      selectedFileFilters: state.filesToDisplay !== 'data products' ? ['data products'] : [],
    }));
  },
}));

export default useFilesStore;
