import { createContext, useContext } from 'js/helpers/context';
import React, { useMemo, useState } from 'react';
import { CellTypeCountWithPercentageAndOrgan } from './utils';

export interface CellTypesDistributionChartContextType {
  showPercentages: boolean;
  setShowPercentages: (show: boolean) => void;
  showOtherCellTypes: boolean;
  setShowOtherCellTypes: (show: boolean) => void;
  symLogScale: boolean;
  setSymLogScale: (use: boolean) => void;
}

const CellTypesDistributionChartContext = createContext<CellTypesDistributionChartContextType>(
  'CellTypesDistributionChartContext',
);

export const useCellTypesDistributionChartContext = () => useContext(CellTypesDistributionChartContext);
export default function CellTypesDistributionChartContextProvider({ children }: React.PropsWithChildren) {
  const [showPercentages, setShowPercentages] = useState<boolean>(false);
  const [showOtherCellTypes, setShowOtherCellTypes] = useState<boolean>(false);
  const [symLogScale, setSymLogScale] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      showPercentages,
      setShowPercentages,
      showOtherCellTypes,
      setShowOtherCellTypes,
      symLogScale,
      setSymLogScale,
    }),
    [showPercentages, showOtherCellTypes, symLogScale],
  );

  return (
    <CellTypesDistributionChartContext.Provider value={value}>{children}</CellTypesDistributionChartContext.Provider>
  );
}

interface CellTypeDataContextType {
  cellTypeCounts: Record<string, CellTypeCountWithPercentageAndOrgan[]>;
  colorScale: (cellType: string) => string;
}

const CellTypeDataContext = createContext<CellTypeDataContextType>('CellTypeDataContext');

export const CellTypeDataContextProvider = CellTypeDataContext.Provider;
export const useCellTypeDataContext = () => useContext(CellTypeDataContext);
