import create from 'zustand';

const savedAlertStatus = 'savedAlert';
const editedAlertStatus = 'editedAlert';

const useEntityStore = create((set) => ({
  summaryComponentObserver: {
    summaryInView: true,
    summaryEntry: undefined,
  },
  setSummaryComponentObserver: (inView, entry) =>
    set({
      summaryComponentObserver: {
        summaryInView: inView,
        summaryEntry: entry,
      },
    }),
  assayMetadata: {},
  setAssayMetadata: (val) => set({ assayMetadata: val }),
  shouldDisplaySavedOrEditedAlert: false,
  setShouldDisplaySavedOrEditedAlert: (val) => set({ shouldDisplaySavedOrEditedAlert: val }),
}));

export { savedAlertStatus, editedAlertStatus };
export default useEntityStore;
