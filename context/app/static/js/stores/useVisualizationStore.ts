import { debounce } from 'js/helpers/nodash';
import { create } from 'zustand';

type VizTheme = 'light' | 'dark';
interface VisualizationStoreState {
  vizIsFullscreen: boolean;
  vizEscSnackbarIsOpen: boolean;
  vizTheme: VizTheme;
  vitessceState: unknown;
  onCopyUrlWarning: string;
  vizNotebookId: string | null;
}

interface VisualizationStoreActions {
  setVizEscSnackbarIsOpen: (val: boolean) => void;
  expandViz: () => void;
  collapseViz: () => void;
  setVizTheme: (theme: VizTheme) => void;
  setVitessceState: (val: unknown) => void;
  setVitessceStateDebounced: (val: unknown) => void;
  setOnCopyUrlWarning: (val: string) => void;
  setVizNotebookId: (val: string) => void;
}

type VisualizationStore = VisualizationStoreState & VisualizationStoreActions;

const useVisualizationStore = create<VisualizationStore>((set) => ({
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
  setVitessceStateDebounced: debounce((val) => set({ vitessceState: val }), 250),
  onCopyUrlWarning: '',
  setOnCopyUrlWarning: (val) => set({ onCopyUrlWarning: val }),
  vizNotebookId: null,
  setVizNotebookId: (val) => set({ vizNotebookId: val }),
}));

export default useVisualizationStore;
