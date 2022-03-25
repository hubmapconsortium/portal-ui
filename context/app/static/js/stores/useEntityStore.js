import create from 'zustand';

const savedAlertStatus = 'savedAlert';
const editedAlertStatus = 'editedAlert';

const useEntityStore = create((set) => ({
  assayMetadata: {},
  setAssayMetadata: (val) => set({ assayMetadata: val }),
  shouldDisplaySavedOrEditedAlert: false,
  setShouldDisplaySavedOrEditedAlert: (val) => set({ shouldDisplaySavedOrEditedAlert: val }),
}));

export { savedAlertStatus, editedAlertStatus };
export default useEntityStore;
