import create from 'zustand';

const useVisualizationStore = create((set) => ({
  vizIsFullscreen: false,
  vizGreySnackbarIsOpen: false,
  setVizGreySnackbarIsOpen: (val) => set({ vizGreySnackbarIsOpen: val }),
  expandViz: () => {
    set({ vizIsFullscreen: true, vizGreySnackbarIsOpen: true });
    document.onkeydown = function preventDefault(evt) {
      if (evt.keyCode === 27) evt.preventDefault();
    };
  },
  collapseViz: () => {
    set({ vizIsFullscreen: false, vizGreySnackbarIsOpen: false });
    document.onkeydown = null;
  },
  vizTheme: 'light',
  setVizTheme: (theme) => {
    if (!['dark', 'light'].includes(theme)) {
      return;
    }
    set({ vizTheme: theme });
  },
  vitessceConfig: {},
  setVitessceConfig: (val) => set({ vitessceConfig: val }),
  onCopyUrlMessage: '',
  setOnCopyUrlMessage: (val) => set({ onCopyUrlMessage: val }),
  onCopyUrlMessageSnackbarOpen: false,
  setOnCopyUrlMessageSnackbarOpen: (val) => set({ onCopyUrlMessageSnackbarOpen: val }),
}));

export default useVisualizationStore;
