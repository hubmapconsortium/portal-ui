import create from 'zustand';

const useStore = create((set) => ({
  summaryInView: false,
  setSummaryInView: (bool) => set({ summaryInView: bool }),
}));

export default useStore;
