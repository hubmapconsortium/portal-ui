import { debounce } from 'js/helpers/nodash';
import { create } from 'zustand';

type VizTheme = 'light' | 'dark';
interface VisualizationStoreState {
  fullscreenVizId: string | null;
  vizEscSnackbarIsOpen: boolean;
  vizTheme: VizTheme;
  vitessceState: unknown;
  onCopyUrlWarning: string;
  vizNotebookId: string | null;
  vitessceVisualization?: boolean;
}

interface VisualizationStoreActions {
  setVizEscSnackbarIsOpen: (val: boolean) => void;
  expandViz: (vizId: string, isVitessce?: boolean) => void;
  collapseViz: () => void;
  setVizTheme: (theme: VizTheme) => void;
  setVitessceState: (val: unknown) => void;
  setVitessceStateDebounced: (val: unknown) => void;
  setOnCopyUrlWarning: (val: string) => void;
  setVizNotebookId: (val: string) => void;
}

export type VisualizationStore = VisualizationStoreState & VisualizationStoreActions;

export const useVisualizationStore = create<VisualizationStore>((set) => ({
  fullscreenVizId: null,
  vitessceVisualization: false,
  vizEscSnackbarIsOpen: false,
  setVizEscSnackbarIsOpen: (val) => {
    set({ vizEscSnackbarIsOpen: val });
  },
  expandViz: (vizId: string, isVitessce) => {
    set({ fullscreenVizId: vizId, vizEscSnackbarIsOpen: true, vitessceVisualization: isVitessce });
    document.onkeydown = function preventDefault(evt) {
      if (evt.keyCode === 27) evt.preventDefault();
    };
  },
  collapseViz: () => {
    set({ fullscreenVizId: null, vizEscSnackbarIsOpen: false, vitessceVisualization: false });
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
  setVitessceState: (val) => {
    set({ vitessceState: val });
  },
  setVitessceStateDebounced: debounce((val) => {
    set({ vitessceState: val });
  }, 250),
  onCopyUrlWarning: '',
  setOnCopyUrlWarning: (val) => {
    set({ onCopyUrlWarning: val });
  },
  vizNotebookId: null,
  setVizNotebookId: (val) => {
    set({ vizNotebookId: val });
  },
}));

export default useVisualizationStore;
