import { createContext, useContext } from 'js/helpers/context';
import React, { useMemo, useState } from 'react';
import { useEventCallback } from '@mui/material/utils';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import { CellTypeCountWithPercentageAndOrgan } from './utils';

export interface CellTypesDistributionChartContextType {
  showPercentages: boolean;
  setShowPercentages: (show: boolean) => void;
  showOtherCellTypes: boolean;
  setShowOtherCellTypes: (show: boolean) => void;
  symLogScale: boolean;
  setSymLogScale: (use: boolean) => void;
  dataType: SCFindModality; // undefined = RNA, 'ATAC' = ATAC
  setDataType: (dataType: SCFindModality) => void;
}

const CellTypesDistributionChartContext = createContext<CellTypesDistributionChartContextType>(
  'CellTypesDistributionChartContext',
);

export const useCellTypesDistributionChartContext = () => useContext(CellTypesDistributionChartContext);

interface CellTypesDistributionChartContextProviderProps extends React.PropsWithChildren {
  /** Controlled data-type value. Only takes effect when `onDataTypeChange` is also provided. */
  dataType?: SCFindModality;
  /** When provided, the data-type toggle becomes controlled and changes are reported here. */
  onDataTypeChange?: (dataType: SCFindModality) => void;
}

export default function CellTypesDistributionChartContextProvider({
  children,
  dataType: controlledDataType,
  onDataTypeChange,
}: CellTypesDistributionChartContextProviderProps) {
  const [showPercentages, setShowPercentages] = useState<boolean>(false);
  const [showOtherCellTypes, setShowOtherCellTypes] = useState<boolean>(false);
  const [symLogScale, setSymLogScale] = useState<boolean>(false);
  const [internalDataType, setInternalDataType] = useState<SCFindModality>(undefined);

  // `undefined` is a meaningful value (RNA), so controlled mode is keyed off the presence of
  // `onDataTypeChange` rather than `dataType !== undefined`.
  const isControlled = onDataTypeChange !== undefined;
  const dataType = isControlled ? controlledDataType : internalDataType;
  const setDataType = useEventCallback((next: SCFindModality) => {
    if (!isControlled) {
      setInternalDataType(next);
    }
    onDataTypeChange?.(next);
  });

  const value = useMemo(
    () => ({
      showPercentages,
      setShowPercentages,
      showOtherCellTypes,
      setShowOtherCellTypes,
      symLogScale,
      setSymLogScale,
      dataType,
      setDataType,
    }),
    [showPercentages, showOtherCellTypes, symLogScale, dataType, setDataType],
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
