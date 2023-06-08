import { create } from 'zustand';

const useFilesStore = create((set) => ({
  displayOnlyQaQc: false,
  toggleDisplayOnlyQaQc: () => set((state) => ({ displayOnlyQaQc: !state.displayOnlyQaQc })),
}));

export default useFilesStore;
