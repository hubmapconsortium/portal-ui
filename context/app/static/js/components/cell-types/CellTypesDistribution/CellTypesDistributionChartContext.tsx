import { createContext, useContext } from 'js/helpers/context';
import React, { useMemo, useState } from 'react';

export interface CellTypesDistributionChartContextType {
  showPercentages: boolean;
  setShowPercentages: (show: boolean) => void;
  showOtherCellTypes: boolean;
  setShowOtherCellTypes: (show: boolean) => void;
}

const CellTypesDistributionChartContext = createContext<CellTypesDistributionChartContextType>(
  'CellTypesDistributionChartContext',
);

export const useCellTypesDistributionChartContext = () => useContext(CellTypesDistributionChartContext);
export default function CellTypesDistributionChartContextProvider({ children }: React.PropsWithChildren) {
  const [showPercentages, setShowPercentages] = useState<boolean>(false);
  const [showOtherCellTypes, setShowOtherCellTypes] = useState<boolean>(true);

  const value = useMemo(
    () => ({
      showPercentages,
      setShowPercentages,
      showOtherCellTypes,
      setShowOtherCellTypes,
    }),
    [showPercentages, showOtherCellTypes],
  );

  return (
    <CellTypesDistributionChartContext.Provider value={value}>{children}</CellTypesDistributionChartContext.Provider>
  );
}
