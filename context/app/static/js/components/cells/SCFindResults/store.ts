import { create } from 'zustand';

interface SCFindResultsStatisticsStoreState {
  cellTypeStats: {
    total: number;
    targeted: number;
  };
  datasetStats: {
    datasets: {
      matched: number;
      indexed: number;
      total: number;
    };
    donors: {
      matched: number;
      indexed: number;
      total: number;
    };
  };
}

interface SCFindResultsStatisticsStoreAction {
  setCellTypeStats: (stats: SCFindResultsStatisticsStoreState['cellTypeStats']) => void;
  setDatasetStats: (stats: SCFindResultsStatisticsStoreState['datasetStats']) => void;
}

const defaultState: SCFindResultsStatisticsStoreState = {
  cellTypeStats: {
    total: 0,
    targeted: 0,
  },
  datasetStats: {
    datasets: {
      matched: 0,
      indexed: 0,
      total: 0,
    },
    donors: {
      matched: 0,
      indexed: 0,
      total: 0,
    },
  },
};
export type SCFindResultsStatisticsStore = SCFindResultsStatisticsStoreState & SCFindResultsStatisticsStoreAction;
export const useSCFindResultsStatisticsStore = create<SCFindResultsStatisticsStore>((set) => ({
  ...defaultState,
  setCellTypeStats: (cellTypeStats) => {
    set({ cellTypeStats });
  },
  setDatasetStats: (datasetStats) => {
    set({ datasetStats });
  },
}));
export default useSCFindResultsStatisticsStore;
