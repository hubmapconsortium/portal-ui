import { debounce } from 'lodash';
import create from 'zustand';

const useVisualizationStore = create((set) => ({
  vizIsFullscreen: false,
  vizEscSnackbarIsOpen: false,
  setVizEscSnackbarIsOpen: (val) => set({ vizEscSnackbarIsOpen: val }),
  expandViz: () => {
    set({ vizIsFullscreen: true, vizEscSnackbarIsOpen: true });
    document.onkeydown = function preventDefault(evt) {
      if (evt.keyCode === 27) evt.preventDefault();
    };
  },
  collapseViz: () => {
    set({ vizIsFullscreen: false, vizEscSnackbarIsOpen: false });
    document.onkeydown = null;
  },
  vizTheme: 'light',
  setVizTheme: (theme) => {
    if (!['dark', 'light'].includes(theme)) {
      return;
    }
    set({ vizTheme: theme });
  },
  vitessceState: null,
  setVitessceState: (val) => set({ vitessceState: val }),
  // TODO: change this debounce to use react 18 suspense transitions instead?
  setVitessceStateDebounced: debounce((val) => set({ vitessceState: val }), 250, { trailing: true }),
  onCopyUrlWarning: '',
  setOnCopyUrlWarning: (val) => set({ onCopyUrlWarning: val }),
  onCopyUrlSnackbarOpen: false,
  setOnCopyUrlSnackbarOpen: (val) => set({ onCopyUrlSnackbarOpen: val }),
  vizNotebookId: null,
  setVizNotebookId: (val) => set({ vizNotebookId: val }),
}));

export default useVisualizationStore;
